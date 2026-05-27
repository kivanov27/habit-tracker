import "./index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Habit, User } from "./types";
import HabitForm from "./components/HabitForm";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);

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

    const handleCompletion = async (habitId: number, checked: boolean) => {
        try {
            await fetch(`/api/habits/${habitId}`, { 
                method: checked ? "POST" : "DELETE" 
            });
        }
        catch (err) {
            console.error("Failed to completed habit: ", err);
        }
    };

    return (
        <div className="relative">
            {user &&
                <div className="absolute top-1 left-1">
                    user: {user.username}
                </div>
            }

            <div className="flex flex-col p-16">
                <ul className="flex flex-col gap-y-8">
                    {habits.map(habit =>
                        <li key={habit.id} className="flex items-center">
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleCompletion(habit.id, e.target.checked)}
                                className="me-2"
                            />
                            <p className="w-32">{habit.habit}</p>
                            <div className="flex">
                                {dates.map(date =>
                                    <div
                                        key={date}
                                        className={`${habit.completions.includes(date as string) ? "bg-green-200" : "bg-red-200"} w-8 h-8 border border-gray-700`}
                                    ></div>
                                )}
                            </div>
                        </li>
                    )}
                </ul>

                <button
                    onClick={() => setFormOpen(true)}
                    className="mt-16"
                >
                    add habit
                </button>
            </div>

            <HabitForm open={formOpen} setOpen={setFormOpen} setHabits={setHabits} />
        </div>
    );
}

export default App;
