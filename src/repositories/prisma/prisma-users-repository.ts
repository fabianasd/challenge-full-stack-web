import { prisma } from "../../lib/prisma"
import { Prisma, Person } from "@prisma/client"
import type { UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.PersonCreateInput) {
        const person = await prisma.person.create({ data })
        return person
    }

    async findByEmail(email: string) {
        const person = await prisma.person.findUnique({ where: { email } })
        return person;
    }

    async findByCPF(cpf: string) {
        const person = await prisma.person.findUnique({ where: { document: cpf } })
        return person
    }

    async listAll(): Promise<Person[]> {
        return prisma.person.findMany({ orderBy: { personId: 'asc' } })
    }

    async findByRA(ra: string) {
        const user = await prisma.student.findFirst({
            where: { ra },
            include: { person: true },
        })
        return user
    }
}
