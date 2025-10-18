import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeUpdateUserUseCase } from '../../use-cases/factories/make-update-user-use-case';
import { StudentError } from '../../shared/errors/students.error';
import { ERROR_MESSAGES } from '../../shared/errors/error-messages';

const bodySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().email().optional(),
  })
  .refine((body) => body.name !== undefined || body.email !== undefined, {
    message: 'No editable fields',
  });

const paramsSchema = z.object({
  ra: z.string().trim().min(1, 'RA é obrigatório'),
});

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { ra } = paramsSchema.parse(request.params);
  const parsedBody = bodySchema.parse(request.body);

  const updates: { name?: string; email?: string } = {
    ...(parsedBody.name !== undefined ? { name: parsedBody.name } : {}),
    ...(parsedBody.email !== undefined ? { email: parsedBody.email } : {}),
  };

  try {
    const updateStudentUseCase = makeUpdateUserUseCase(request)
    const { data, error } = await updateStudentUseCase.execute({
      ra,
      name: parsedBody.name,
      email: parsedBody.email,
    })

    if (error) {
      throw error;
    }

    return reply.status(200).send(data);
  } catch (err) {
    if (err instanceof StudentError) {
      return reply
        .status(err.statusCode || 500)
        .send({ error: { type: err.errorType, message: err.message } });
    }

    return reply
      .status(500)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
