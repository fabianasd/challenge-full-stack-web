import { Prisma, type Person, type Student } from "@prisma/client"
import { StudentEntity } from "../entities/student"

export type StudentWithPerson = Student & { person: Person }
export type PersonWithStudent = Prisma.PersonGetPayload<{ include: { student: true } }>

export interface UsersRepository {
    create(studentEntity: StudentEntity): Promise<StudentEntity | null>
    findByEmail(email: string): Promise<StudentEntity | null>
    findByCPF(cpf: string): Promise<StudentEntity | null>
    listAll(): Promise<PersonWithStudent[]>
    findByRA(ra: string): Promise<StudentWithPerson | null>
    updateEditable(personId: bigint, data: { name?: string; email?: string }): Promise<Person>
    deleteByRA(ra: string): Promise<void>
}
