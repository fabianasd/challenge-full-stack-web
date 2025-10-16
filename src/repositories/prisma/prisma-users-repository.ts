import { Prisma } from "@prisma/client"
import type { Person } from "@prisma/client"
import { prisma } from "../../lib/prisma"
import type { PersonWithStudent, UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.PersonCreateInput) {
    return prisma.person.create({ data })
  }

  async findByEmail(email: string) {
    return prisma.person.findUnique({ where: { email } })
  }

  async findByCPF(cpf: string) {
    return prisma.person.findUnique({ where: { document: cpf } })
  }

  async listAll(): Promise<PersonWithStudent[]> {
    const users = await prisma.person.findMany({
        orderBy: { personId: 'asc' },
        include: { student: true }
    })
    return users;
  }

  async findByRA(ra: string) {
    return prisma.student.findFirst({
      where: { ra },
      include: { person: true },
    })
  }

  async updateEditable(personId: bigint, data: { name?: string; email?: string }): Promise<Person> {
    const updateData: Prisma.PersonUpdateInput = {}
    if (data.name !== undefined) {
      updateData.fullName = data.name
    }
    if (data.email !== undefined) {
      updateData.email = data.email
    }

    try {
      return await prisma.person.update({
        where: { personId },
        data: updateData,
      })
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new Error('NOT_FOUND')
        }
        if (err.code === 'P2002') {
          const target = err.meta?.target
          const targets = Array.isArray(target) ? target : target ? [target] : []
          if (targets.includes('email') || targets.includes('person_email_key')) {
            throw new Error('EMAIL_TAKEN')
          }
        }
      }
      throw err
    }
  }
}
