import type { User } from "../types";

interface TodoPageProps {
    user: User;
    handleGainXp: (amount: number) => void;
}

const TodoPage = ({ user, handleGainXp }: TodoPageProps) => {
    return (
        <div>todo page</div>
    );
};

export default TodoPage;
