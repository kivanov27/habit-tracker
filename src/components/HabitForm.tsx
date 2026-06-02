import type { NewHabit } from "@/types";
import { useState } from "react";

interface HabitFormProps {
    handleAddHabit: (newHabit: NewHabit) => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HabitForm = ({ handleAddHabit, setOpen }: HabitFormProps) => {
    const [habit, setHabit] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const newHabit: NewHabit = {
            habit,
            color
        };

        handleAddHabit(newHabit);
    };

    return (
        <div 
            onClick={() => setOpen(false)}
            className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex justify-center items-center"
        >
            <form 
                onSubmit={submitForm}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col border-2 border-(--text-color) w-4xl mx-auto my-auto p-8 items-center gap-y-4 bg-(--bg-color) rounded-sm"
            >
                <div className="flex gap-x-2 items-center">
                    <label>habit:</label>
                    <input 
                        type="text" 
                        value={habit}
                        onChange={({ target }) => setHabit(target.value)} 
                        className="rounded-sm"
                    />
                </div>

                <div className="flex gap-x-2 items-center">
                    <label>color:</label>
                    <input
                        type="color"
                        value={color}
                        onChange={({ target }) => setColor(target.value)}
                        className="rounded-sm"
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
        </div>
    );
};

export default HabitForm;
