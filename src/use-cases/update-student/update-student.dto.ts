import { StudentEntity } from "../../entities/student";
import { StudentError } from "../../shared/errors/students.error";

export type UpdateStudentInput = {
  name?: string;
  email?: string;
  ra: string;
};

export type UpdateStudentOutput = {
  data?: StudentEntity;
  error?: StudentError;
};
