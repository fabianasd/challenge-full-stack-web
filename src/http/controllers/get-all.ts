import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeListUsersUseCase } from '../../use-cases/factories/make-list-users-use-case'

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListUsersUseCase()
  const { users } = await useCase.execute()

  const safe = users.map(({ personId, ...rest }) => ({
    personId: personId.toString(),
    ...rest,
  }))

  return reply.status(200).send(safe)
}