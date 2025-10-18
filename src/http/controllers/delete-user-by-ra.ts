import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteUserByRAUseCase } from '../../use-cases/factories/make-delete-user-by-ra-use-case';
import { ResourceNotFoundError } from '../../use-cases/get-user-by-ra';

const paramsSchema = z.object({
  ra: z.string().trim().min(1, 'RA é obrigatório'),
});

export async function deleteUserByRA(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { ra } = paramsSchema.parse(request.params);

  try {
    const delUser = makeDeleteUserByRAUseCase(request);
    await delUser.execute({ ra });
    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
