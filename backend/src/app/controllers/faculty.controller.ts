import { Hono } from "hono";
import { Context } from "hono";
import { faculties } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from 'drizzle-orm'

const facultyController = new Hono<{ Bindings: { DB: D1Database } }>()


facultyController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page"));
    console.log(page)
    const limit = 2;
    const skip = (page - 1) * limit;
    const result = await db.select().from(faculties).limit(limit).offset(skip)
    return ctx.json(result);
})

facultyController.get("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    const result = await db.select().from(faculties).where(eq(faculties.id, id));

    if (result.length === 0) {
        return ctx.json({ error: "Faculty not found" }, 404);
    }
    return ctx.json(result[0]);
})

interface Faculty {
    name: string;
}

facultyController.post("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const faculty: Faculty = await ctx.req.json();
    const result = await db.insert(faculties).values(faculty).returning();
    return ctx.json(result)
})

facultyController.put("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));
    const body: Faculty = await ctx.req.json();

    const result = await db
        .update(faculties)
        .set(body)
        .where(eq(faculties.id, id)).returning();

    return ctx.json(result);
})

facultyController.delete("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    await db.delete(faculties).where(eq(faculties.id, id));
    
    return ctx.json({ message: "Faculty deleted successfully" });
})

export { facultyController }