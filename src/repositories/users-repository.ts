import { Prisma, type Person } from "@prisma/client"

export interface UsersRepository {
    create(data: Prisma.PersonCreateInput): Promise<Person>
    findByEmail(email: string): Promise<Person | null>
    findByCPF(cpf: string): Promise<Person | null>
    listAll(): Promise<Person[]>
}