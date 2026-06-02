import "./index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Habit, User } from "./types";
import { HabitView } from "./types";
import Header from "./components/Header";
import HabitForm from "./components/HabitForm";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [view, setView] = useState<HabitView>(HabitView.Weekly);

    const navigate = useNavigate();

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
    }).reverse();

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

    const handleCompletion = async (habitId: number, date: string, complete: boolean) => {
        try {
            await fetch(`/api/habits/${habitId}?date=${date}`, {
                method: complete ? "DELETE" : "POST",
            });

            setHabits(prev => prev.map(habit => {
                if (habit.id !== habitId) return habit;
                return {
                    ...habit,
                    completions: complete
                        ? habit.completions.filter(d => d !== date)
                        : [...habit.completions, date]
                };
            }));
        }
        catch (err) {
            console.error("Failed to completed habit: ", err);
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


            <div className="flex flex-col px-16 py-8 gap-y-8">

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
                        <li key={habit.id} className="flex items-center">
                            <p className="w-32">{habit.habit}</p>
                            <div className="flex">
                                {dates.map(date =>
                                    <div
                                        key={date}
                                        className={`
                                            ${habit.completions.includes(date as string) ? "bg-green-200" : "bg-red-200"}
                                            w-8 h-8 border border-gray-700 cursor-pointer
                                        `}
                                        onClick={() => handleCompletion(habit.id, date as string, habit.completions.includes(date as string))}
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

            <HabitForm open={formOpen} setOpen={setFormOpen} setHabits={setHabits} />
        </div>
    );
}

export default App;
