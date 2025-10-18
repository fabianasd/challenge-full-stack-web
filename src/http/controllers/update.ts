import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeUpdateUserUseCase } from '../../use-cases/factories/make-update-user-use-case';
import {
  EmailAlreadyInUseError,
  NoEditableFieldsError,
  ResourceNotFoundError,
} from '../../use-cases/update-users';

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
    const { user } = await makeUpdateUserUseCase().execute({ ra, ...updates });

    const safeUser = {
      personId: user.personId.toString(),
      fullName: user.fullName,
      email: user.email,
      ra,
    };

    return reply.status(200).send(safeUser);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'User not found' });
    }
    if (err instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ message: 'Email already in use' });
    }
    if (err instanceof NoEditableFieldsError) {
      return reply
        .status(400)
        .send({ message: 'Provide at least one editable field' });
    }
    throw err;
  }
}
