import { IStudentsRepository, Student } from "../entities/student";

export class StudentService {
  constructor(private studentsRepository: IStudentsRepository) {}

  async createStudent(data: Omit<Student, "id">): Promise<Student> {
    return this.studentsRepository.create(data);
  }

  async getStudentById(id: number): Promise<Student | null> {
    return this.studentsRepository.getById(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentsRepository.getAll();
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<void> {
    await this.studentsRepository.update(id, data);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentsRepository.delete(id);
  }
}
