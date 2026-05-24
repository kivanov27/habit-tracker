import { useState } from "react";

const RegistrationForm = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleRegistration = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!isValidPassword(password)) {
            setError('password must be at least 6 characters long, contain an uppercase and lowercase letter, a digit and a special symbol');
        }
        else {
            setError("");
        }
    };

    const isValidPassword = (password: string): boolean => {
        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    return (
        <form 
            onSubmit={handleRegistration}
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

            {error && <p className="text-red-300">{error}</p>}

            <button
                type="submit"
                className="mx-auto"
            >
                register
            </button>
        </form>
    );
};

export default RegistrationForm;
