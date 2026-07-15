import type { Todo } from "../types";
import { Trash, Pencil } from "lucide-react";

interface TodoItemProps {
    todo: Todo;
    handleComplete: (todo: Todo) => void;
    handleDelete: (id: number) => void;
    setTodoToEdit: React.Dispatch<React.SetStateAction<Todo | null>>;
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoItem = ({ todo, handleComplete, handleDelete, setTodoToEdit, setFormOpen }: TodoItemProps) => {
    return (
        <li className={`${todo.completed ? "completed" : ""} todo-item relative flex gap-x-2 w-fit`}>
            <div className="checkbox-wrapper">
                <input type="checkbox" onChange={() => handleComplete(todo)} />
                <span className="checkmark"></span>
            </div>

            <p className="w-fit">{todo.task}</p>

            <button
                onClick={() => {
                    setTodoToEdit(todo);
                    setFormOpen(true);
                }}
                style={{ border: 0 }}
            >
                <Pencil size={16} />
            </button>

            <button
                onClick={() => handleDelete(todo.id)}
                style={{ border: 0 }}
            >
                <Trash size={16} />
            </button>
        </li>
    );
};

export default TodoItem;
