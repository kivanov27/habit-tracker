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

        // User endpoints
        "/api/me": {
            async GET(req) {
                const user = verifyToken(req);
                if (!user) return Response.json({ authentication: false }, { status: 401 });
                return Response.json({ authentication: true , user });
            },
        },

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
                    { id: Number(user.id), username: user.username },
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

        "/api/logout": {
            async POST() {
                return new Response(JSON.stringify({ success: true }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": "token=; HttpOnly; Secure; SameSite=Strict; Path=/; MaxAge=0"
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

        // Habit endpoints
        "/api/habits": {
            async GET(req) {
                const user = verifyToken(req);
                if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

                const res = await db.execute({
                    sql: `
                        SELECT
                            habits.*,
                            GROUP_CONCAT(habitCompletions.completedAt) as completions
                        FROM habits
                        LEFT JOIN habitCompletions ON habits.id = habitCompletions.habitId
                        WHERE habits.userId = ?
                        GROUP BY habits.id
                    `,
                    args: [user.id],
                });

                const habits = res.rows.map(row => ({
                    ...row,
                    completions: row.completions ? (row.completions as string).split(",") : []
                }));

                return Response.json({ habits });
            },

            async POST(req) {
                const user = verifyToken(req);
                if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

                const { habit, color } = await req.json();

                const res = await db.execute({
                    sql: "INSERT INTO habits (userId, habit, color) VALUES (?, ?, ?) RETURNING *",
                    args: [user.id, habit, color]
                });

                return Response.json({ 
                    success: true, 
                    habit: { 
                        ...res.rows[0], 
                        completions: [] 
                    }
                });
            },
        },

        "/api/habits/:id": {
            async POST(req) {
                const url = new URL(req.url);
                const date = url.searchParams.get("date");
                const user = verifyToken(req);
                const habitId = Number(req.params.id);

                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }
                else if (isNaN(habitId)) {
                    return Response.json({ error: "Invalid id" }, { status: 400 });
                }

                await db.execute({
                    sql: "INSERT INTO habitCompletions (habitId, completedAt, userId) VALUES (?, ?, ?)",
                    args: [habitId, date, user.id]
                });

                return Response.json({ success: true });
            },

            async DELETE(req) {
                const url = new URL(req.url);
                const date = url.searchParams.get("date");
                const user = verifyToken(req);
                const habitId = Number(req.params.id);

                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }
                else if (isNaN(habitId)) {
                    return Response.json({ error: "Invalid id" }, { status: 400 });
                }

                await db.execute({
                    sql: "DELETE FROM habitCompletions WHERE habitId = ? AND completedAt = ? AND userId = ?",
                    args: [habitId, date, user.id]
                });

                return Response.json({ success: true });
            }
        }
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,
        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
