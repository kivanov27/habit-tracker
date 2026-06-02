import type { Habit, NewHabit } from "@/types";
import { useState } from "react";

interface HabitFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitForm = ({ open, setOpen, setHabits }: HabitFormProps) => {
    const [habit, setHabit] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const newHabit: NewHabit = {
            habit,
            color
        };

        const res = await fetch("/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHabit)
        });

        const data = await res.json();

        if (data.success) {
            setHabits(prev => [...prev, data.habit]);
        }

        setOpen(false);
    };

    return (
        <form 
            onSubmit={submitForm}
            className={`${open ? 'flex' : 'hidden'} flex-col border-2 border-(--text-color) w-4xl mx-auto my-4 p-8 items-center gap-y-4`}
        >
            <div className="flex gap-x-2 items-center">
                <label>habit:</label>
                <input 
                    type="text" 
                    value={habit}
                    onChange={({ target }) => setHabit(target.value)} 
                />
            </div>

            <div className="flex gap-x-2 items-center">
                <label>color:</label>
                <input
                    type="color"
                    value={color}
                    onChange={({ target }) => setColor(target.value)}
                />
            </div>

            <div className="flex gap-x-2">
                <button 
                    type="submit"
                >
                    submit
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                    }}
                >
                    close
                </button>
            </div>
        </form>
    );
};

export default HabitForm;
