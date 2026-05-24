import { useState } from "react";

const LoginForm = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(username, password);
    };

    return (
        <form 
            onSubmit={handleLogin}
            className="flex flex-col gap-y-4"
        >
            <div className="flex gap-x-2 justify-center items-center">
                <label>username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>

            <div className="flex gap-x-2 justify-center items-center">
                <label>password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>

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
