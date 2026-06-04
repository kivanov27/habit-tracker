import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import LoginPage from "./pages/LoginPage";

function start() {
    const root = createRoot(document.getElementById("root")!);

    root.render(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
}
else {
    start();
}
