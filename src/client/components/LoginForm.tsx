import { useState } from "react";
import { useNavigate } from "react-router";

const LoginForm = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            navigate("/habits");
        }
        else {
            setError(data.error);
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className="flex flex-col gap-y-4 w-fit"
        >
            <div className="flex gap-x-2 justify-end items-center">
                <label>username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>

            <div className="flex gap-x-2 justify-end items-center">
                <label>password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>

            {error && <p className="text-red-300">{error}</p>}

            <button
                type="submit"
                className="mx-auto"
            >
                login
            </button>
        </form>
    );
};

export default LoginForm;
