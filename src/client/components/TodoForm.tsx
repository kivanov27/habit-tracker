import { useState } from "react";
import type { NewTodo } from "../types";

interface TodoFormProps {
    handleAddTodo: (newTodo: NewTodo) => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoForm = ({ handleAddTodo, setOpen }: TodoFormProps) => {
    const [task, setTask] = useState<string>("");

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        handleAddTodo({ task });
    };

    return (
        <div
            onClick={() => setOpen(false)}
            className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex justify-center items-center"
        >
            <form
                onSubmit={submitForm}
                onClick={e => e.stopPropagation()}
                className="w-xl mx-auto my-auto p-8 border-2 border-(--text-color) bg-(--bg-color) rounded-sm flex flex-col items-center gap-y-4"
            >
                <div className="flex gap-x-2 items-center">
                    <label>task:</label>
                    <input
                        type="text"
                        required
                        value={task}
                        onChange={({ target }) => setTask(target.value)}
                        className="rounded-sm"
                    />
                </div>

                <button type="submit">
                    submit
                </button>
            </form>
        </div>
    );
};

export default TodoForm;
