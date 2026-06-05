import { useEffect, useState } from "react";
import type { Habit, NewHabit, User } from "../types";
import { HabitView } from "../types";
import HabitForm from "../components/HabitForm";
import { Pencil, Trash } from "lucide-react";

interface HabitsProps {
    user: User;
    handleGainXp: (amount: number) => void;
}

const HabitPage = ({ user, handleGainXp }: HabitsProps) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [view, setView] = useState<HabitView>(HabitView.Weekly);
    const [dates, setDates] = useState<(string | undefined)[]>([]);

    const fetchHabits = async () => {
        // maybe return a boolean to handle error display
        try {
            const res = await fetch("/api/habits");
            if (!res.ok) {
                throw new Error(`Failed to fetch habits: ${res.status}`);
            }

            const data = await res.json();
            setHabits(data.habits);
        }
        catch (err) {
            console.error("Failed to fetch habits: ", err);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    useEffect(() => {
        let days;

        switch (view) {
            case HabitView.Weekly:
                days = 7;
                break;
            case HabitView.Monthly:
                days = 30;
                break;
            case HabitView.Yearly:
                days = 255;
                break;
            default: days = 7;
        }

        setDates(Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse());
    }, [view]);

    const handleAddHabit = async (newHabit: NewHabit) => {
        setFormOpen(false);

        const res = await fetch("/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHabit)
        });

        const data = await res.json();

        if (data.success) {
            setHabits(prev => [...prev, data.habit]);
        }
    };

    const handleCompleteHabit = async (habitId: number, date: string, complete: boolean) => {
        try {
            if (user) {
                // Change habits in state
                setHabits(prev => prev.map(habit => {
                    if (habit.id !== habitId) return habit;
                    return {
                        ...habit,
                        completions: complete
                            ? habit.completions.filter(d => d !== date)
                            : [...habit.completions, date]
                    };
                }));

                // Add xp to user
                complete ? handleGainXp(-1) : handleGainXp(1);

                // Change habits in db
                await fetch(`/api/habits/completions/${habitId}?date=${date}`, {
                    method: complete ? "DELETE" : "POST",
                });
            }
        }
        catch (err) {
            console.error("Failed to completed habit: ", err);
        }
    };

    const handleEditHabit = async (updatedHabit: Habit) => {
        try {
            setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
            setHabitToEdit(null);
            setFormOpen(false);

            await fetch(`/api/habits/${updatedHabit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedHabit)
            });
        }
        catch (err) {
            console.error("Failed to update habit: ", err);
        }
    };

    const handleDeleteHabit = async (habitId: number) => {
        try {
            setHabits(prev => prev.filter(habit => habit.id !== habitId));

            await fetch(`/api/habits/${habitId}`, {
                method: "DELETE"
            });
        }
        catch (err) {
            console.error("Failed to delete habit: ", err);
        }
    };


    return (
        <div>
            <div className="max-w-xl mx-auto flex flex-col items-center pt-8 pb-16 gap-y-8">

                <div className="flex gap-x-1">
                    {Object.values(HabitView).map(viewOption => (
                        <button
                            key={viewOption}
                            onClick={() => setView(viewOption)}
                            className={`${view === viewOption ? "bg-neutral-500" : ""}`}
                        >
                            {viewOption}
                        </button>
                    ))}
                </div>

                <ul className="flex flex-col gap-y-8">
                    {habits.map(habit =>
                        <li
                            key={habit.id}
                            className="border rounded-sm p-2"
                            style={{
                                borderColor: habit.color,
                                backgroundColor: `${habit.color}10`
                            }}
                        >
                            <div className="flex justify-center items-center gap-x-2 mb-1">
                                <p
                                    className="text-center"
                                    style={{ color: habit.color }}
                                >
                                    {habit.habit}
                                </p>
                                <button
                                    onClick={() => {
                                        setHabitToEdit(habit);
                                        setFormOpen(true);
                                    }}
                                    style={{ borderColor: habit.color }}
                                >
                                    <Pencil
                                        size={16}
                                        style={{ color: habit.color }}
                                    />
                                </button>
                                <button
                                    onClick={() => handleDeleteHabit(habit.id)}
                                    style={{ borderColor: habit.color }}
                                >
                                    <Trash
                                        size={16}
                                        style={{ color: habit.color }}
                                    />
                                </button>
                            </div>
                            <div className="flex flex-wrap max-w-120">
                                {dates.map(date =>
                                    <div
                                        key={date}
                                        className="w-8 h-8 border border-neutral-700 cursor-pointer"
                                        style={{
                                            backgroundColor: habit.completions.includes(date as string) ? habit.color : "var(--bg-color)"
                                        }}
                                        onClick={() => handleCompleteHabit(habit.id, date as string, habit.completions.includes(date as string))}
                                    ></div>
                                )}
                            </div>
                        </li>
                    )}
                </ul>

                <button onClick={() => setFormOpen(true)}>
                    add habit
                </button>
            </div>

            {formOpen && <HabitForm handleAddHabit={handleAddHabit} handleEditHabit={handleEditHabit} existingHabit={habitToEdit} setOpen={setFormOpen} />}
        </div>
    );
};

export default HabitPage;
