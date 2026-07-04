import type { Todo } from "../types";

interface TodoItemProps {
    todo: Todo;
    handleComplete: (todo: Todo) => void;
}

const TodoItem = ({ todo, handleComplete }: TodoItemProps) => {
    return (
        <li className={`${todo.completed ? "completed" : ""} todo-item relative flex gap-x-2 w-fit`}>
            <div className="checkbox-wrapper">
                <input type="checkbox" checked={todo.completed} onChange={() => handleComplete(todo)} />
                <span className="checkmark"></span>
            </div>
            <p className="w-fit">{todo.task}</p>
        </li>
    );
};

export default TodoItem;
