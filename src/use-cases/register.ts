import type { UsersRepository } from "../repositories/users-repository"
import type { Person } from "@prisma/client"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { CpfAlreadyInUseError } from "./errors/cpf-already-in-use-error"

interface RegisterUseCaseRequest {
    name: string
    email: string
    cpf: string
}

interface RegisterUseCaseResponse {
    user: Person
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ name, email, cpf }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)
        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const userWithSameCPF = await this.usersRepository.findByCPF(cpf)
        if (userWithSameCPF) {
            throw new CpfAlreadyInUseError()
        }

        const user = await this.usersRepository.create({
            fullName: name,
            email,
            document: cpf,
        })

        return { user }
    }
}
