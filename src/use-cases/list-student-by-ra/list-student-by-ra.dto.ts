import { StudentWithPerson } from '../../repositories/users-repository';

export type ListStudentByRAInput = {
    ra: string;
};

export type ListStudentByRAOutput = {
    student: StudentWithPerson;
};
