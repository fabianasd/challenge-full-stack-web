import { StudentEntity } from '../../entities/student';

export type ListStudentByRAInput = {
    ra: string;
};

export type ListStudentByRAOutput = {
    data: StudentEntity;
};
