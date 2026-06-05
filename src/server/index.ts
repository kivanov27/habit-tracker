import { serve } from "bun";
import index from "../client/index.html";
import bcrypt from "bcrypt";
import { db } from "./db";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth";

const server = serve({
    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,

        // User endpoints
        "/api/me": {
            async GET(req) {
                const token = verifyToken(req);
                if (!token) {
                    return Response.json({ authentication: false }, { status: 401 });
                }

                const res = await db.execute({
                    sql: `
                        SELECT *
                        FROM users
                        WHERE id = ?
                    `,
                    args: [token.id]
                });
                return Response.json({ authentication: true, user: res.rows[0] });
            },
        },

        "/api/register": {
            async POST(req) {
                const { username, email, password } = await req.json();
                const saltRounds = 10;
                const passwordHash = await bcrypt.hash(password, saltRounds);

                await db.execute({
                    sql: `
                        INSERT INTO users (username, email, passwordHash, level, xp)
                        VALUES (?, ?, ?, ?, ?)
                    `,
                    args: [username, email, passwordHash, 1, 0],
                });

                return Response.json({ success: true });
            },
        },

        "/api/login": {
            async POST(req) {
                const { username, password } = await req.json();

                const res = await db.execute({
                    sql: `
                        SELECT * FROM users
                        WHERE username = ?
                    `,
                    args: [username],
                });

                const user = res.rows[0];

                if (!user) {
                    return Response.json(
                        { success: false, error: "Invalid username or password" },
                        { status: 401 }
                    );
                }

                const passwordMatch = await bcrypt.compare(password, user.passwordHash as string);

                if (!passwordMatch) {
                    return Response.json(
                        { success: false, error: "Invalid username or password" },
                        { status: 401 }
                    );
                }

                const token = jwt.sign(
                    {
                        id: Number(user.id),
                        username: user.username,
                    },
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
                const token = verifyToken(req);
                if (!token) {
                    return Response.json(
                        { error: "Unauthorized" },
                        { status: 401 }
                    );
                }
                return Response.json({ success: true });
            },
        },

        "/api/users/xp": {
            async POST(req) {
                const token = verifyToken(req);
                if (!token) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }

                const { amount } = await req.json();
                if (typeof amount !== "number") {
                    return Response.json({ error: "Invalid amount" }, { status: 400 });
                }

                const resUser = await db.execute({
                    sql: `
                        SELECT id, level, xp
                        FROM users
                        WHERE id = ?
                    `,
                    args: [token.id]
                });

                const user = resUser.rows[0];
                if (!user) {
                    return Response.json({ error: "User not found" }, { status: 404 });
                }

                const totalXp = Number(user.xp) + amount;
                const levelsGained = Math.floor(totalXp / 100);
                const level = Number(user.level) + levelsGained;
                const xp = totalXp % 100;

                const res = await db.execute({
                    sql: `
                            UPDATE users
                            SET level = ?, xp = ?
                            WHERE id = ?
                            RETURNING *
                        `,
                    args: [level, xp, Number(user.id)]
                });

                return Response.json({
                    success: true,
                    user: res.rows[0]
                });
            },
        },

        // Habit endpoints
        "/api/habits": {
            async GET(req) {
                const user = verifyToken(req);
                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }

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
                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }

                const { habit, color } = await req.json();

                const res = await db.execute({
                    sql: `
                        INSERT INTO habits (userId, habit, color)
                        VALUES (?, ?, ?)
                        RETURNING *
                    `,
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
            async PUT(req) {
                const user = verifyToken(req);
                const id = Number(req.params.id);
                const updatedHabit = await req.json();

                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }
                else if (isNaN(id)) {
                    return Response.json({ error: "Invalid id" }, { status: 400 });
                }

                const res = await db.execute({
                    sql: `
                        UPDATE habits
                        SET habit = ?, color = ?
                        WHERE id = ? AND userId = ?
                        RETURNING *
                    `,
                    args: [updatedHabit.habit, updatedHabit.color, id, user.id]
                });

                if (res.rows.length === 0) {
                    return Response.json(
                        { error: "Habit not found" },
                        { status: 404 }
                    );
                }

                return Response.json({
                    success: true,
                    updatedHabit: res.rows[0]
                });
            },
            async DELETE(req) {
                const user = verifyToken(req);
                const habitId = Number(req.params.id);

                if (!user) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }
                else if (isNaN(habitId)) {
                    return Response.json({ error: "Invalid id" }, { status: 400 });
                }

                await db.execute({
                    sql: `
                        DELETE FROM habits
                        WHERE id = ? AND userId = ?
                    `,
                    args: [habitId, user.id]
                });

                return Response.json({ success: true });
            }
        },

        "/api/habits/completions/:id": {
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
                    sql: `
                        INSERT INTO habitCompletions (habitId, completedAt, userId)
                        VALUES (?, ?, ?)
                    `,
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
                    sql: `
                        DELETE FROM habitCompletions
                        WHERE habitId = ? AND completedAt = ? AND userId = ?
                    `,
                    args: [habitId, date, user.id]
                });

                return Response.json({ success: true });
            }
        },

        // Todo endpoints
        "/api/todos": {
            async GET(req) {
                const token = verifyToken(req);
                if (!token) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }

                const res = await db.execute({
                    sql: `
                        SELECT *
                        FROM todos
                        WHERE userId = ?
                    `,
                    args: [token.id]
                });

                return Response.json({ todos: res.rows });
            },
            async POST(req) {
                const token = verifyToken(req);
                if (!token) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }

                const { task } = await req.json();

                const res = await db.execute({
                    sql: `
                        INSERT INTO todos (userId, task)
                        VALUES (?, ?)
                        RETURNING *
                    `,
                    args: [token.id, task]
                });

                return Response.json({
                    success: true,
                    todo: res.rows[0]
                });
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
