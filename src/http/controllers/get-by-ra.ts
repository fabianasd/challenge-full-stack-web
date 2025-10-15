import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetUserByRAUseCase } from '../../use-cases/factories/make-get-by-ra-use-case'
import { ResourceNotFoundError } from '../../use-cases/get-user-by-ra'

export async function getUserByRA(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ra: z.string().trim().min(1, 'RA é obrigatório'),
  })
  const { ra } = paramsSchema.parse(request.params)

  try {
    const useCase = makeGetUserByRAUseCase()
    const { user } = await useCase.execute({ ra })

    const safeStudent = {
      personId: user.personId.toString(),
      ra: user.ra,
      person: {
        personId: user.person.personId.toString(),
        fullName: user.person.fullName,
        email: user.person.email,
        document: user.person.document,
      },
    }

    return reply.status(200).send(safeStudent)

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
