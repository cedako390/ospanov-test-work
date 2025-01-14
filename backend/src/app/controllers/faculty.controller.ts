import { Hono } from "hono";
import { Context } from "hono";
import { faculties, specializations } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from 'drizzle-orm'

const facultyController = new Hono<{ Bindings: { DB: D1Database } }>()

facultyController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page") || 1);

    const limit = 2;

    if (page === -1) {
        const data = await db
            .select({
                id: faculties.id,
                name: faculties.name,
            })
            .from(faculties);

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
            id: faculties.id,
            name: faculties.name,
            totalRecords: sql<number>`COUNT(*) OVER()`
        })
        .from(faculties)
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

facultyController.get("/by-specialization/:specializationId", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const specializationId = Number(ctx.req.param("specializationId"));

    if (isNaN(specializationId)) {
        return ctx.json({ error: "Некорректный ID специальности" }, 400);
    }

    const data = await db
        .select({
            id: faculties.id,
            name: faculties.name,
        })
        .from(faculties)
        .innerJoin(specializations, eq(faculties.id, specializations.facultyId))
        .where(eq(specializations.id, specializationId));

    return ctx.json({ data });
});


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