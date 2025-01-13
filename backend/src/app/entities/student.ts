export class Student {
    id: number;
    lastName: string;
    firstName: string;
    middleName: string | null;
    facultyId: number;
    specializationId: number;

    constructor(
        id: number,
        lastName: string,
        firstName: string,
        middleName: string | null,
        facultyId: number,
        specializationId: number
    ) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.facultyId = facultyId;
        this.specializationId = specializationId;
    }
}