import type { Person } from '@prisma/client';
import type {
  PersonWithStudent,
  StudentWithPerson,
  UsersRepository,
} from '../users-repository.js';
import { StudentEntity } from '../../entities/student.js';

type InMemoryRecord = {
  personId: bigint;
  student: StudentEntity;
};

export class InMemoryUsersRepository implements UsersRepository {
  private records: InMemoryRecord[] = [];
  private personIdSeq = 1n;

  private toPerson(record: InMemoryRecord): Person {
    return {
      personId: record.personId,
      fullName: record.student.name,
      email: record.student.email,
      document: record.student.document,
    };
  }

  private toPersonWithStudent(record: InMemoryRecord): PersonWithStudent {
    return {
      ...this.toPerson(record),
      student: {
        personId: record.personId,
        ra: record.student.ra,
      },
    };
  }

  private toStudentWithPerson(record: InMemoryRecord): StudentWithPerson {
    return {
      personId: record.personId,
      ra: record.student.ra,
      person: this.toPerson(record),
    };
  }

  async create(studentEntity: StudentEntity): Promise<StudentEntity | null> {
    const record: InMemoryRecord = {
      personId: this.personIdSeq++,
      student: new StudentEntity(
        studentEntity.name,
        studentEntity.email,
        studentEntity.document,
        studentEntity.ra,
      ),
    };

    this.records.push(record);

    return record.student;
  }

  async findByEmail(email: string): Promise<StudentEntity | null> {
    const record = this.records.find((item) => item.student.email === email);
    return record ? record.student : null;
  }

  async findByCPF(cpf: string): Promise<StudentEntity | null> {
    const record = this.records.find((item) => item.student.document === cpf);
    return record ? record.student : null;
  }

  async listAll(): Promise<PersonWithStudent[]> {
    return this.records
      .map((record) => this.toPersonWithStudent(record))
      .sort((a, b) => {
        if (a.personId === b.personId) return 0;
        return a.personId > b.personId ? 1 : -1;
      });
  }

  async findByRA(ra: string): Promise<StudentWithPerson | null> {
    const record = this.records.find((item) => item.student.ra === ra);
    return record ? this.toStudentWithPerson(record) : null;
  }

  async updateEditable(
    ra: string,
    data: { name?: string; email?: string },
  ): Promise<StudentEntity | null> {
    const index = this.records.findIndex((item) => item.student.ra === ra);
    if (index < 0) {
      throw new Error('NOT_FOUND');
    }

    const current = this.records[index]!;

    const isEmailTaken =
      data.email !== undefined &&
      data.email !== current.student.email &&
      this.records.some(
        (item) => item.student.email === data.email && item.student.ra !== ra,
      );

    if (isEmailTaken) {
      throw new Error('EMAIL_TAKEN');
    }

    const updatedStudent = new StudentEntity(
      data.name ?? current.student.name,
      data.email ?? current.student.email,
      current.student.document,
      current.student.ra,
    );

    const updatedRecord: InMemoryRecord = {
      personId: current.personId,
      student: updatedStudent,
    };

    this.records[index] = updatedRecord;

    return null;
  }

  async deleteByRA(ra: string): Promise<number> {
    const index = this.records.findIndex((item) => item.student.ra === ra);
    if (index < 0) {
      throw new Error('NOT_FOUND');
    }

    this.records.splice(index, 1);

    return 1;
  }
}
