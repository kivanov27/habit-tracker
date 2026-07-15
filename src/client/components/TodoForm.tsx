import { useState } from "react";
import type { Todo, NewTodo } from "../types";

interface TodoFormProps {
    handleAddTodo: (newTodo: NewTodo) => void;
    handleEditTodo?: (updatedTodo: Todo) => void;
    existingTodo?: Todo | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoForm = ({ handleAddTodo, handleEditTodo, existingTodo, setOpen }: TodoFormProps) => {
    const [task, setTask] = useState<string>(existingTodo?.task ?? "");

    const submitForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (existingTodo && handleEditTodo) {
            handleEditTodo({ ...existingTodo, task });
        }
        else {
            handleAddTodo({ task, completed: false });
        }
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

                <div className="flex gap-x-2">
                    <button type="submit">
                        {existingTodo ? "edit" : "submit"}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setOpen(false);
                        }}
                    >close</button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;
