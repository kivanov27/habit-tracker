import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RegistrationFormProps {
    setRegistering: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationForm = ({ setRegistering }: RegistrationFormProps) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleRegistration = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!isValidPassword(password)) {
            setError('password must be at least 6 characters long, contain an uppercase and lowercase letter, a digit and a special symbol');
        }
        else {
            setError("");

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            if (res.ok) {
                alert("registered successfully");
                setRegistering(false);
            }
            else {
                console.error("couldn't register");
            }
        }
    };

    const isValidPassword = (password: string): boolean => {
        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    return (
        <form
            onSubmit={handleRegistration}
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
                <label>email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>

            <div className="flex gap-x-2 justify-end items-center relative">
                <label>password:</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
                {showPassword ?
                    <EyeOff
                        size={16}
                        onClick={() => setShowPassword(false)}
                        className="absolute right-[-22] cursor-pointer"
                    />
                    :
                    <Eye
                        size={16}
                        onClick={() => setShowPassword(true)}
                        className="absolute right-[-22] cursor-pointer"
                    />
                }
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
