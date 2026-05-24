import "./index.css";
import { useState } from "react";
import HabitForm from "./components/HabitForm";

const App = () => {
    const [formOpen, setFormOpen] = useState<boolean>(false);

    return (
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
            <button
                onClick={() => setFormOpen(true)}
                className="cursor-pointer border border-(--text-color) w-fit p-2 transition-colors duration-200 active:bg-(--text-color)"
            >
                add habit
            </button>

            <HabitForm open={formOpen} setOpen={setFormOpen} />
        </div>
    );
}

export default App;
