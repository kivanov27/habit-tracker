import type { User } from "@/types"
import AccountMenu from "./AccountMenu";

interface HeaderProps {
    user: User;
    handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
    return (
        <div className="px-10 py-2 min-h-14 border-b border-b-(--text-color) flex justify-between items-center">
            <div></div>
            <AccountMenu user={user} handleLogout={handleLogout} />
        </div>
    );
};

export default Header;
