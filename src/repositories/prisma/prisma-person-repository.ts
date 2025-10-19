import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { PersonWithStudent, UsersRepository } from '../users-repository';
import { StudentEntity } from '../../entities/student';
import { StudentError } from '../../shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';

export class PrismaPersonRepository implements UsersRepository {
  async create(studentEntity: StudentEntity): Promise<StudentEntity | null> {
    const data = {
      fullName: studentEntity.name,
      email: studentEntity.email,
      document: studentEntity.document,
      student: {
        create: {
          ra: studentEntity.ra,
        },
      },
    };

    const student: PersonWithStudent = await prisma.person.create({
      data,
      include: { student: true },
    });

    return this.toEntity(student);
  }

  async findByEmail(email: string): Promise<StudentEntity | null> {
    const person = await prisma.person.findUnique({
      where: { email },
      include: { student: true },
    });

    if (!person) return null;

    return this.toEntity(person);
  }

  async findByCPF(cpf: string) {
    const person = await prisma.person.findUnique({
      where: { document: cpf },
      include: { student: true },
    });

    if (!person) return null;

    return this.toEntity(person);
  }

  async listAll(): Promise<PersonWithStudent[]> {
    const users = await prisma.person.findMany({
      orderBy: { personId: 'asc' },
      include: { student: true },
    });
    return users;
  }

  async findByRA(ra: string) {
    return prisma.student.findFirst({
      where: { ra },
      include: { person: true },
    });
  }

  async updateEditable(
    ra: string,
    data: { name?: string; email?: string },
  ): Promise<StudentEntity | null> {
    const updateData: Prisma.PersonUpdateInput = {};
    if (data.name !== '') {
      updateData.fullName = data.name;
    }
    if (data.email !== '') {
      updateData.email = data.email;
    }

    const student = await prisma.student.findFirst({
      where: { ra },
      select: { personId: true },
    });

    if (!student) {
      throw new StudentError(
        ERROR_MESSAGES.STUDENT_NOT_FOUND,
        ERROR_TYPE.STUDENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const updatedPerson = await prisma.person.update({
      where: { personId: student.personId },
      data: updateData,
      include: { student: true },
    });

    return this.toEntity(updatedPerson);
  }

  async deleteByRA(ra: string): Promise<number> {
    const result = await prisma.person.deleteMany({
      where: {
        student: {
          is: {
            ra,
          },
        },
      },
    });

    return result.count;
  }

  toEntity(user: PersonWithStudent): StudentEntity | null {
    if (!user) {
      return null;
    }

    return new StudentEntity(
      user.fullName,
      user.email,
      user.document,
      user.student?.ra || '',
    );
  }
}
