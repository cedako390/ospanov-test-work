import { Hono } from "hono";
import { Context } from "hono";
import { students } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from 'drizzle-orm';

const studentController = new Hono<{ Bindings: { DB: D1Database } }>();

studentController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page"));
    const limit = 2;
    const skip = (page - 1) * limit;
    const result = await db.select().from(students).limit(limit).offset(skip);
    return ctx.json(result);
});

studentController.get("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    const result = await db.select().from(students).where(eq(students.id, id));

    if (result.length === 0) {
        return ctx.json({ error: "Student not found" }, 404);
    }
    return ctx.json(result[0]);
});

interface Student {
    lastName: string;
    firstName: string;
    middleName?: string;
    facultyId: number;
    specializationId: number;
}

studentController.post("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const student: Student = await ctx.req.json();
    const result = await db.insert(students).values(student).returning();
    return ctx.json(result);
});

studentController.put("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));
    const body: Student = await ctx.req.json();

    const result = await db
        .update(students)
        .set(body)
        .where(eq(students.id, id)).returning();

    return ctx.json(result);
});

studentController.delete("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    await db.delete(students).where(eq(students.id, id));
    
    return ctx.json({ message: "Student deleted successfully" });
});

export { studentController };
