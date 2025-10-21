import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateUserUseCase } from '../../use-cases/factories/make-create-user-use-case';
import { AuthError } from '../../shared/errors/auth.error';
import { ERROR_MESSAGES } from '../../shared/errors/error-messages';

const registerUserBodySchema = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email().max(255),
  document: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'Documento deve conter 11 dígitos'),
  password: z.string().min(8).max(255),
  roles: z.array(z.string().min(1)).nonempty(),
});

export async function registerAuthUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { fullName, email, document, password, roles } =
    registerUserBodySchema.parse(request.body);

  try {
    const useCase = makeCreateUserUseCase(request);
    const { data, error } = await useCase.execute({
      fullName,
      email,
      document,
      password,
      roles,
    });

    if (error) {
      return reply.status(error.statusCode || 500).send(error);
    }

    return reply.status(201).send({ data });
  } catch (err) {
    if (err instanceof AuthError) {
      return reply.status(err.statusCode).send({
        error: {
          type: err.errorType,
          message: err.message,
        },
      });
    }

    request.log.error({ err }, 'register_auth_user_error');

    return reply.status(500).send({
      error: {
        type: 'internal_server_error',
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
