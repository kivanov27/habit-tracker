export interface User {
    id: number;
    username: string;
    email: string;
    level: number;
    xp: number;
}

export interface Habit {
    id: number;
    habit: string;
    color: string;
    completions: string[];
}

export interface NewHabit {
    habit: string;
    color: string;
}

export enum HabitView {
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly"
}

export interface Todo {
    id: number;
    task: string;
    completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;
