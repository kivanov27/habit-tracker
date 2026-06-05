import { useState, useEffect, useRef } from "react";
import type { User } from "../types";

interface AccountMenuProps {
    user: User;
    handleLogout: () => void;
}

const AccountMenu = ({ user, handleLogout }: AccountMenuProps) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!menuVisible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuVisible]);

    return (
        <div className="flex items-center justify-between">

            {/* Level display */}
            <div className="flex items-center gap-x-4">
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
            </div>

            {/* User button */}
            <div className="relative" ref={menuRef}>
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
