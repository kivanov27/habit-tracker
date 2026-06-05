import { Link } from "react-router";
import { BrickWall, SquareCheck } from 'lucide-react';

const Navigation = () => {
    return (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex rounded-sm border px-2 py-1 bg-(--bg-color)">
            <Link
                to="/habits"
                className="hover:bg-(--text-color)/20 p-2 rounded-full transition-colors"
            >
                <BrickWall />
            </Link>
            <Link
                to="/todos"
                className="hover:bg-(--text-color)/20 p-2 rounded-full transition-colors"
            >
                <SquareCheck />
            </Link>
        </div>
    );
};

export default Navigation;
