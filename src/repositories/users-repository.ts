import { Prisma, type Person, type Student } from "@prisma/client"

export type StudentWithPerson = Student & { person: Person }

export interface UsersRepository {
    create(data: Prisma.PersonCreateInput): Promise<Person>
    findByEmail(email: string): Promise<Person | null>
    findByCPF(cpf: string): Promise<Person | null>
    listAll(): Promise<Person[]>
    findByRA(ra: string): Promise<StudentWithPerson | null>
}
