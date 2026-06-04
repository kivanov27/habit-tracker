import "./index.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import type { User } from "./types";
import Header from "./components/Header";
import HabitPage from "./pages/HabitPage";
import TodoPage from "./pages/TodoPage";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.authentication) {
            return data.user;
        }
        return null;
    };

    useEffect(() => {
        const init = async () => {
            const user = await fetchUser();
            if (!user) {
                navigate("/login");
                return;
            }
            setUser(user);
        }

        init();
    }, []);

    const handleLogout = async () => {
        setUser(null);

        await fetch("/api/logout", {
            method: "POST"
        });

        navigate("/login");
    };

    const handleGainXp = async (amount: number) => {
        // if u wanna do optimistic update, save previous state and revert to it in the catch block
        try {
            const res = await fetch(`api/users/xp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });

            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            }
        }
        catch (err) {
            console.error("Couldn't update xp: ", err);
        }
    };

    if (!user) {
        return <p>Loading...</p>
    }

    return (
        <div className="relative">
            <Header user={user} handleLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<Navigate to="/habits" replace />} />
                <Route path="/habits" element={<HabitPage user={user} handleGainXp={handleGainXp} />} />
                <Route path="/todos" element={<TodoPage user={user} handleGainXp={handleGainXp} />} />
            </Routes>
        </div>
    );
}

export default App;
