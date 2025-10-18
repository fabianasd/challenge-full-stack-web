import { StudentError } from '../../shared/errors/students.error';

export type DeleteStudentInput = {
  ra: string;
};

export type DeleteStudentOutput = {
  error?: StudentError;
};
