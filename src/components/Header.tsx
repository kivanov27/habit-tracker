import type { User } from "@/types"
import { useState } from "react";

interface HeaderProps {
    user: User;
    handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    return (
        <div className="px-10 py-2 min-h-14 border-b border-b-(--text-color) flex justify-between items-center">
            <div></div>
            <div>
                <button
                    onClick={() => setMenuVisible(!menuVisible)}
                >
                    {user.username}
                </button>
                <ul className={`${menuVisible ? "block" : "hidden"} py-2 absolute bg-white text-black border border-gray-500 rounded-sm`}>
                    <li
                        className="cursor-pointer hover:bg-gray-200 px-2"
                        onClick={handleLogout}
                    >
                        logout
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
