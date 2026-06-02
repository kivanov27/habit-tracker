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
    const [dates, setDates] = useState<(string | undefined)[]>([]);
    const [view, setView] = useState<HabitView>(HabitView.Weekly);

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
                            <div>
                                <p className="text-center mb-1">{habit.habit}</p>
                                <button>edit</button>
                                <button>delete</button>
                            </div>
                            <div className="flex flex-wrap max-w-240">
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
