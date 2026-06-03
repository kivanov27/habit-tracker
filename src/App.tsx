import "./index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Habit, NewHabit, User } from "./types";
import { HabitView } from "./types";
import Header from "./components/Header";
import HabitForm from "./components/HabitForm";
import { Pencil, Trash } from "lucide-react";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [dates, setDates] = useState<(string | undefined)[]>([]);
    const [view, setView] = useState<HabitView>(HabitView.Weekly);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHabits = async () => {
            const res = await fetch("/api/habits");
            const data = await res.json();
            setHabits(data.habits);
        };

        const checkUser = async () => {
            const res = await fetch("/api/me");
            const data = await res.json();
            if (data.authentication) {
                setUser(data.user);
                fetchHabits();
            }
            else {
                navigate("/login");
            }
        };

        checkUser();
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
            case HabitView. Yearly: 
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
            setHabits(prev => prev.map(habit => {
                if (habit.id !== habitId) return habit;
                return {
                    ...habit,
                    completions: complete
                        ? habit.completions.filter(d => d !== date)
                        : [...habit.completions, date]
                };
            }));

            await fetch(`/api/habits/completions/${habitId}?date=${date}`, {
                method: complete ? "DELETE" : "POST",
            });
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

    const handleLogout = async () => {
        setUser(null);

        await fetch("/api/logout", {
            method: "POST"
        });

        navigate("/login");
    };

    return (
        <div className="relative">
            {user &&
                <Header user={user} handleLogout={handleLogout} />
            }

            <div className="max-w-7xl mx-auto flex flex-col items-center px-16 py-8 gap-y-8">

                <div className="flex gap-x-1">
                    <button 
                        onClick={() => setView(HabitView.Weekly)}
                        className={`${view == HabitView.Weekly ? "bg-neutral-500" : ""}`}
                    >
                        weekly
                    </button>
                    <button 
                        onClick={() => setView(HabitView.Monthly)}
                        className={`${view == HabitView.Monthly ? "bg-neutral-500" : ""}`}
                    >
                        monthly
                    </button>
                    <button 
                        onClick={() => setView(HabitView.Yearly)}
                        className={`${view == HabitView.Yearly ? "bg-neutral-500" : ""}`}
                    >
                        yearly
                    </button>
                </div>

                <ul className="flex flex-col gap-y-8">
                    {habits.map(habit =>
                        <li key={habit.id}>
                            <div className="flex justify-center items-center gap-x-2 mb-1">
                                <p className="text-center">{habit.habit}</p>
                                <button
                                    onClick={() => {
                                        setHabitToEdit(habit);
                                        setFormOpen(true);
                                    }}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteHabit(habit.id)}
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap max-w-125">
                                {dates.map(date =>
                                    <div
                                        key={date}
                                        className={`
                                            ${habit.completions.includes(date as string) ? "bg-green-200" : "bg-red-200"}
                                            w-8 h-8 border border-gray-700 cursor-pointer
                                        `}
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
}

export default App;
