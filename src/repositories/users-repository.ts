import { Prisma, type Person, type Student } from "@prisma/client"

export type StudentWithPerson = Student & { person: Person }
export type PersonWithStudent = Prisma.PersonGetPayload<{ include: { student: true } }>

export interface UsersRepository {
    create(data: Prisma.PersonCreateInput): Promise<Person>
    findByEmail(email: string): Promise<Person | null>
    findByCPF(cpf: string): Promise<Person | null>
    listAll(): Promise<PersonWithStudent[]>
    findByRA(ra: string): Promise<StudentWithPerson | null>
    updateEditable(personId: bigint, data: { name?: string; email?: string }): Promise<Person>
    deleteByRA(ra: string): Promise<void>
}
