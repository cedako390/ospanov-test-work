import { Hono } from 'hono'
import { studentController } from './app/controllers/student.controller';
import { facultyController } from './app/controllers/faculty.controller';
import { specializationController } from './app/controllers/specialization.controller';
import { cors } from 'hono/cors';

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors())
app.route("/students", studentController);
app.route("/faculties", facultyController);
app.route("/specializations", specializationController);

export default app
