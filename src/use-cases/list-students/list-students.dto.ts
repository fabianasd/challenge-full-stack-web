import { StudentEntity } from '../../entities/student';
import { StudentError } from '../../shared/errors/students.error';

export type ListStudentOutput = {
  data?: StudentEntity[];
  error?: StudentError;
};
