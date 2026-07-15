import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import type { Todo, NewTodo, User } from "../types";

interface TodoPageProps {
    user: User;
    handleGainXp: (amount: number) => void;
}

const TodoPage = ({ user, handleGainXp }: TodoPageProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

    const fetchTodos = async () => {
        try {
            const res = await fetch("/api/todos");
            if (!res.ok) {
                throw new Error(`Failed to fetch todos: ${res.status}`);
            }

            const data = await res.json();
            setTodos(data.todos);
        }
        catch (err) {
            console.error("Failed to fetch todos: ", err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddTodo = async (newTodo: NewTodo) => {
        setFormOpen(false);

        const res = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        });

        const data = await res.json();

        if (data.success) {
            setTodos(prev => [...prev, data.todo]);
        }
    };

    const handleCompleteTodo = async (todo: Todo) => {
        try {
            if (user) {
                setTodos(prev => prev.map(t =>
                    t.id == todo.id ? { ...todo, completed: true } : t
                ));

                setTimeout(async () => {
                    setTodos(prev => prev.filter(t => t.id !== todo.id));
                    handleGainXp(1);

                    await fetch(`/api/todos/${todo.id}`, {
                        method: "DELETE"
                    });
                }, 500);
            }
        }
        catch (err) {
            console.error("Failed to complete todo: ", err);
        }
    };

    const handleEditTodo = async (updatedTodo: Todo) => {
        try {
            setTodos(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
            setTodoToEdit(null);
            setFormOpen(false);

            await fetch(`/api/todos/${updatedTodo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTodo)
            });
        }
        catch (err) {
            console.error("Failed to update todo: ", err);
        }
    }

    const handleDeleteTodo = async (id: number) => {
        try {
            setTodos(prev => prev.filter(todo => todo.id !== id));

            await fetch(`/api/todos/${id}`, {
                method: "DELETE"
            });
        }
        catch (err) {
            console.error("Failed to delete todo: ", err);
        }
    }

    return (
        <div>
            <div className="max-w-xl mx-auto flex flex-col items-center pt-8 pb-16 gap-y-8">
                <ul className="flex flex-col gap-y-8">
                    {todos.map(todo =>
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            handleComplete={handleCompleteTodo}
                            handleDelete={handleDeleteTodo}
                            setTodoToEdit={setTodoToEdit}
                            setFormOpen={setFormOpen}
                        />
                    )}
                </ul>
                <button onClick={() => setFormOpen(true)}>
                    add task
                </button>
            </div>

            {formOpen &&
                <TodoForm
                    handleAddTodo={handleAddTodo}
                    handleEditTodo={handleEditTodo}
                    existingTodo={todoToEdit}
                    setOpen={setFormOpen}
                />}
        </div>
    );
};

export default TodoPage;
