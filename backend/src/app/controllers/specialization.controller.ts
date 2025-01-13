import { Hono } from "hono";
import { Context } from "hono";
import { faculties, specializations } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from 'drizzle-orm';

const specializationController = new Hono<{ Bindings: { DB: D1Database } }>();

specializationController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page") || 1);

    const limit = 2;

    if (page === -1) {
        const data = await db
            .select({
                id: specializations.id,
                name: specializations.name,
                facultyName: faculties.name,
            })
            .from(specializations)
            .leftJoin(faculties, eq(specializations.facultyId, faculties.id));

        return ctx.json({
            data,
            meta: {
                currentPage: null,
                totalPages: 1,
                totalRecords: data.length,
                pageSize: data.length,
            },
        });
    }

    const skip = (page - 1) * limit;

    const data = await db
        .select({
            id: specializations.id,
            name: specializations.name,
            facultyName: faculties.name,
            totalRecords: sql<number>`COUNT(*) OVER()`,
        })
        .from(specializations)
        .leftJoin(faculties, eq(specializations.facultyId, faculties.id))
        .limit(limit)
        .offset(skip);

    const totalRecords = data[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return ctx.json({
        data,
        meta: {
            currentPage: page,
            totalPages,
            totalRecords,
            pageSize: limit,
        },
    });
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
