import { serve } from "bun";
import index from "./index.html";
import bcrypt from "bcrypt";
import { db } from "./lib/db";
import jwt from "jsonwebtoken";
import { verifyToken } from "./lib/auth";

const server = serve({
    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,
        "/api/register": {
            async POST(req) {
                const { username, email, password } = await req.json();
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(password, saltRounds);

                await db.execute({
                    sql: "INSERT INTO users (username, email, passwordHash) VALUES (?, ?, ?)",
                    args: [username, email, passwordHash],
                });

                return Response.json({ success: true });
            },
        },
        "/api/login": {
            async POST(req) {
                const { username, password } = await req.json();

                const res = await db.execute({
                    sql: "SELECT * FROM users WHERE username = ?",
                    args: [username],
                });

                const user = res.rows[0];

                if (!user) {
                    return Response.json({ success: false, error: "Invalid username or password" }, { status: 401 });
                }

                const passwordMatch = await bcrypt.compare(password, user.passwordHash as string);

                if (!passwordMatch) {
                    return Response.json({ success: false, error: "Invalid username or password" }, { status: 401 });
                }

                const token = jwt.sign(
                    { id: user.id, username: user.username },
                    process.env.JWT_SECRET!,
                    { expiresIn: "7d" }
                );

                return new Response(JSON.stringify({ success: true }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; MaxAge=${60 * 60 * 24 * 7}`,
                    },
                });
            },
        },
        "/api/protected": {
            async GET(req) {
                const user = verifyToken(req);
                if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
                return Response.json({ success: true, user });
            },
        },
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
