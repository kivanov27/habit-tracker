import { useState } from "react";

interface HabitFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HabitForm = ({ open, setOpen }: HabitFormProps) => {
    const [habit, setHabit] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const submitForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setOpen(false);
    };

    return (
        <form 
            onSubmit={submitForm}
            className={`${open ? 'flex' : 'hidden'} flex-col border-2 border-(--text-color) p-8 items-center gap-y-4 my-4`}
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
                    onClick={() => setOpen(false)}
                >
                    close
                </button>
            </div>
        </form>
    );
};

export default HabitForm;
