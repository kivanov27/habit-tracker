import jwt, { type JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    id: number;
    username: string;
}

export const verifyToken = (req: Request): TokenPayload | null => {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    }
    catch {
        return null;
    }
};

