import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm";

const LoginPage = () => {
    const [registering, setRegistering] = useState<boolean>(false);

    return (
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10 min-h-screen flex flex-col justify-center">
            {registering ?
                <div className="flex flex-col gap-y-4 items-center">
                    <RegistrationForm setRegistering={setRegistering} />
                    <div
                        onClick={() => setRegistering(false)}
                        className="hover:underline hover:text-(--text-color-darker) cursor-pointer"
                    >
                        already registered?
                    </div>
                </div>
            :
                <div className="flex flex-col gap-y-4">
                    <LoginForm />
                    <div
                        onClick={() => setRegistering(true)}
                        className="hover:underline hover:text-(--text-color-darker) cursor-pointer"
                    >
                        don't have an account?
                    </div>
                </div>
            }
        </div>
    );
};

export default LoginPage;
