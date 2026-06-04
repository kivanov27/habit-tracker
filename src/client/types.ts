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
    Weekly,
    Monthly,
    Yearly
}
