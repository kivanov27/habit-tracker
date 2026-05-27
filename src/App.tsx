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

    return (
        <div className="relative">
            {user &&
                <div className="absolute top-1 left-1">
                    user: {user.username}
                </div>
            }

            <div className="flex flex-col items-center pt-16 gap-y-8">
                <ul className="flex flex-col">
                    {habits.map(habit =>
                        <li key={habit.id}>{habit.habit}</li>
                    )}
                </ul>

                <button
                    onClick={() => setFormOpen(true)}
                    className="cursor-pointer border border-(--text-color) w-fit p-2 transition-colors duration-200 active:bg-(--text-color)"
                >
                    add habit
                </button>
            </div>

            <HabitForm open={formOpen} setOpen={setFormOpen} setHabits={setHabits} />
        </div>
    );
}

export default App;
