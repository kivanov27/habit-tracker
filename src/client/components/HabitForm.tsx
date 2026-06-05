import type { Habit, NewHabit } from "@/types";
import { useState } from "react";

interface HabitFormProps {
    handleAddHabit: (newHabit: NewHabit) => void;
    handleEditHabit?: (updatedHabit: Habit) => void;
    existingHabit?: Habit | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HabitForm = ({ handleAddHabit, handleEditHabit, existingHabit, setOpen }: HabitFormProps) => {
    const [habit, setHabit] = useState<string>(existingHabit?.habit ?? "");
    const [color, setColor] = useState<string>(existingHabit?.color ?? "#000000");

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (existingHabit && handleEditHabit) {
            handleEditHabit({ ...existingHabit, habit, color });
        }
        else {
            handleAddHabit({ habit, color });
        }
    };

    return (
        <div
            onClick={() => setOpen(false)}
            className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex justify-center items-center"
        >
            <form
                onSubmit={submitForm}
                onClick={(e) => e.stopPropagation()}
                className="w-xl mx-auto my-auto p-8 border-2 border-(--text-color) bg-(--bg-color) rounded-sm flex flex-col items-center gap-y-4"
            >
                <div className="flex gap-x-2 items-center">
                    <label>habit:</label>
                    <input
                        type="text"
                        required
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
                        {existingHabit ? "edit" : "submit"}
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
