import { useState } from "react";
import type { User } from "@/types";

interface AccountMenuProps {
    user: User;
    handleLogout: () => void;
}

const AccountMenu = ({ user, handleLogout }: AccountMenuProps) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    return (
        <div className="flex gap-x-4 items-center">
            <p>Level {user.level}</p>
            <div className="flex gap-x-2 items-center">
                <div className="w-36 h-4 bg-gray-500">
                    <div
                        className="h-full bg-(--text-color)"
                        style={{ width: `${user.xp}%` }}
                    >
                    </div>
                </div>
                <p>{user.xp} / 100 XP</p>
            </div>
            <div>
                <button onClick={() => setMenuVisible(!menuVisible)}>
                    <span className="font-bold">{user.username}</span>
                </button>
                <ul
                    className={`${menuVisible ? "block" : "hidden"} py-2 absolute bg-white text-black border border-gray-500 rounded-sm`}
                >
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

export default AccountMenu;
