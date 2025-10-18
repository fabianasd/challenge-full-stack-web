import { Prisma } from '@prisma/client';
import type { Person } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { PersonWithStudent, UsersRepository } from '../users-repository';
import { StudentEntity } from '../../entities/student';

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
    personId: bigint,
    data: { name?: string; email?: string },
  ): Promise<Person> {
    const updateData: Prisma.PersonUpdateInput = {};
    if (data.name !== undefined) {
      updateData.fullName = data.name;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    try {
      return await prisma.person.update({
        where: { personId },
        data: updateData,
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new Error('NOT_FOUND');
        }
        if (err.code === 'P2002') {
          const target = err.meta?.target;
          const targets = Array.isArray(target)
            ? target
            : target
              ? [target]
              : [];
          if (
            targets.includes('email') ||
            targets.includes('person_email_key')
          ) {
            throw new Error('EMAIL_TAKEN');
          }
        }
      }
      throw err;
    }
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
