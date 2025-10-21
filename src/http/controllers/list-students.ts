import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeListUsersUseCase } from '../../use-cases/factories/make-list-users-use-case';

export async function listStudents(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeListUsersUseCase(request);
  const { data, error } = await useCase.execute();

  if (error) {
    return reply.status(error.statusCode || 500).send(error);
  }

  return reply.status(200).send({data});
}
