import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeListUserByRAUseCase } from '../../use-cases/factories/make-list-user-by-ra-use-case';
import { StudentError } from '../../shared/errors/students.error';

export async function listStudentUserByRA(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    ra: z.string().trim().min(1, 'RA é obrigatório'),
  });
  const { ra } = paramsSchema.parse(request.params);

  try {
    const useCase = makeListUserByRAUseCase(request);
    const { data } = await useCase.execute({ ra });

    return reply.status(200).send({ data });
  } catch (err) {
    if (err instanceof StudentError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
