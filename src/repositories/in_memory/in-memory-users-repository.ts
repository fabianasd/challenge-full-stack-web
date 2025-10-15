import type { Prisma, Person } from "@prisma/client";
import type { UsersRepository } from "../users-repository.js";

export class InMemoryUsersRepository implements UsersRepository {
    public items: Person[] = []
    private personIdSeq = 1n

    async create(data: Prisma.PersonCreateInput) {
        const user: Person = {
            personId: this.personIdSeq++,
            fullName: data.fullName,
            email: data.email,
            document: data.document,
        }

        this.items.push(user)

        return user
    }

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async findByCPF(cpf: string) {
        const user = this.items.find((item) => item.document === cpf)

        if (!user) {
            return null
        }

        return user
    }
}
