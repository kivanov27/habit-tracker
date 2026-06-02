export interface User {
    id: number;
    username: string;
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
