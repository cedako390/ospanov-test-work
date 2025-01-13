export class Specialization {
    id: number;
    name: string;
    facultyId: number;
  
    constructor(id: number, name: string, facultyId: number) {
      this.id = id;
      this.name = name;
      this.facultyId = facultyId;
    }
  }