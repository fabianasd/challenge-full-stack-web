import { Prisma, type Person, type Student } from '@prisma/client';
import { StudentEntity } from '../entities/student';

export type PersonWithStudent = Prisma.PersonGetPayload<{
  include: { student: true };
}>;

export interface UsersRepository {
  create(studentEntity: StudentEntity): Promise<StudentEntity | null>;
  findByEmail(email: string): Promise<StudentEntity | null>;
  findByCPF(cpf: string): Promise<StudentEntity | null>;
  listAll(): Promise<StudentEntity[] | null>;
  findByRA(ra: string): Promise<StudentEntity | null>;
  updateEditable(
    ra: string,
    data: { name?: string; email?: string },
  ): Promise<StudentEntity | null>;
  deleteByRA(ra: string): Promise<number>;
}
