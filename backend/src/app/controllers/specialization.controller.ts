import { Hono } from "hono";
import { Context } from "hono";
import { specializations } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from 'drizzle-orm';

const specializationController = new Hono<{ Bindings: { DB: D1Database } }>();

specializationController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page"));
    const limit = 2;
    const skip = (page - 1) * limit;
    const result = await db.select().from(specializations).limit(limit).offset(skip);
    return ctx.json(result);
});

specializationController.get("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    const result = await db.select().from(specializations).where(eq(specializations.id, id));

    if (result.length === 0) {
        return ctx.json({ error: "Specialization not found" }, 404);
    }
    return ctx.json(result[0]);
});

interface Specialization {
    name: string;
    facultyId: number;
}

specializationController.post("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const specialization: Specialization = await ctx.req.json();
    const result = await db.insert(specializations).values(specialization).returning();
    return ctx.json(result);
});

specializationController.put("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));
    const body: Specialization = await ctx.req.json();

    const result = await db
        .update(specializations)
        .set(body)
        .where(eq(specializations.id, id)).returning();

    return ctx.json(result);
});

specializationController.delete("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    await db.delete(specializations).where(eq(specializations.id, id));
    
    return ctx.json({ message: "Specialization deleted successfully" });
});

export { specializationController };
