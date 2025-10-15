import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { cpf as cpfValidator } from 'cpf-cnpj-validator'
import { RegisterUseCase } from '../../use-cases/register'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { CpfAlreadyInUseError } from '../../use-cases/errors/cpf-already-in-use-error'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository' 

const onlyDigits = (s: string) => s.replace(/\D/g, '')

const cpfSchema = z.string()
  .transform(onlyDigits)
  .refine((v) => cpfValidator.isValid(v), 'CPF inválido')

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        cpf: cpfSchema
    })

    const { name, email, cpf } = registerBodySchema.parse(request.body)

    try {
        const prismaUsersRespository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUsersRespository)

        await registerUseCase.execute({
            name,
            email,
            cpf,
        })
    } catch (err) {
        if (err instanceof UserAlreadyExistsError || err instanceof CpfAlreadyInUseError) {
            return reply.status(409).send({message: err.message})
        }

        console.error(err)
        if (err instanceof Error) {
            return reply.status(500).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}
