import type { User } from "@/types"

interface HeaderProps {
    user: User;
}

const Header = ({ user }: HeaderProps) => {
    return (
        <div className="px-4 py-2 border-b border-b-(--text-color) flex justify-between">
            <div></div>
            <div>
                {user.username}
            </div>
        </div>
    );
};

export default Header;
