export interface User {
    id: number;
    username: string;
}

export interface Habit {
    id: number;
    habit: string;
    color: string;
}

export type NewHabit = Omit<Habit, 'id'>;
