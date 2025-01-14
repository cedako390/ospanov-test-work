import { Hono } from "hono";
import { Context } from "hono";
import { faculties, specializations, students } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from 'drizzle-orm';

const studentController = new Hono<{ Bindings: { DB: D1Database } }>();

studentController.get("/", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);

    const page = Number(ctx.req.query("page") || 1);
    const limit = 2;
    const skip = (page - 1) * limit;

    const data = await db
        .select({
            id: students.id,
            lastName: students.lastName,
            firstName: students.firstName,
            middleName: students.middleName,
            facultyName: faculties.name,
            specializationName: specializations.name,
            facultId: students.facultyId,
            specializationsId: students.specializationId,
            totalRecords: sql<number>`COUNT(*) OVER()`,
        })
        .from(students)
        .leftJoin(faculties, eq(students.facultyId, faculties.id))
        .leftJoin(specializations, eq(students.specializationId, specializations.id))
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


studentController.get("/:id", async (ctx: Context) => {
    const db = drizzle(ctx.env.DB);
    const id = Number(ctx.req.param("id"));

    const result = await db
        .select({
            id: students.id,
            lastName: students.lastName,
            firstName: students.firstName,
            middleName: students.middleName,
            facultyName: faculties.name,
            specializationName: specializations.name,
        })
        .from(students)
        .leftJoin(faculties, eq(students.facultyId, faculties.id))
        .leftJoin(specializations, eq(students.specializationId, specializations.id))
        .where(eq(students.id, id));

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
