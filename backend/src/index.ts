import { Hono } from 'hono'
import { studentController } from './app/controllers/student.controller';
import { facultyController } from './app/controllers/faculty.controller';
import { specializationController } from './app/controllers/specialization.controller';

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/students", studentController);
app.route("/faculties", facultyController);
app.route("/specializations", specializationController);

export default app
