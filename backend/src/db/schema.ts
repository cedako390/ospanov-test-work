import { sqliteTable, text, integer, primaryKey, foreignKey } from 'drizzle-orm/sqlite-core';

export const faculties = sqliteTable('faculties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const specializations = sqliteTable('specializations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  facultyId: integer('faculty_id')
    .notNull()
    .references(() => faculties.id, { onDelete: 'cascade' }),
});

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lastName: text('last_name').notNull(),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  facultyId: integer('faculty_id')
    .notNull()
    .references(() => faculties.id, { onDelete: 'set null' }),
  specializationId: integer('specialization_id')
    .notNull()
    .references(() => specializations.id, { onDelete: 'set null' }),
});
