import type { Prisma, Person, Student } from "@prisma/client";
import type { StudentWithPerson, UsersRepository } from "../users-repository.js";

export class InMemoryUsersRepository implements UsersRepository {
    public items: Person[] = []
    public ra: Student[] = []
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

    async listAll(): Promise<Person[]> {
        return this.items.slice().sort((a, b) => {
            if (a.personId === b.personId) {
                return 0
            }
            return a.personId > b.personId ? 1 : -1
        })
    }

    async findByRA(ra: string): Promise<StudentWithPerson | null> {
        const student = this.ra.find((item) => item.ra === ra)

        if (!student) {
            return null
        }

        const person = this.items.find((item) => item.personId === student.personId)

        if (!person) {
            return null
        }

        return { ...student, person }
    }
}
