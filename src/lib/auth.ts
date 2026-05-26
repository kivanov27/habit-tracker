import jwt from "jsonwebtoken";

export const verifyToken = (req: Request) => {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    }
    catch {
        return null;
    }
};

