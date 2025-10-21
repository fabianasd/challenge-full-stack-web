import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAuthenticateUserUseCase } from '../../use-cases/factories/make-authenticate-user-use-case';
import { signJwt } from '../../shared/security/jwt';
import { env } from '../../env';
import { AuthError } from '../../shared/errors/auth.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';

const authenticateBodySchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const useCase = makeAuthenticateUserUseCase(request);
    const { data: user } = await useCase.execute({ email, password });

    if (!user) {
      throw new AuthError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        ERROR_TYPE.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const safeUser = user.toSafeDTO();

    const token = signJwt(
      {
        permissions: safeUser.permissions,
        roles: safeUser.roles,
        email: safeUser.email,
      },
      env.JWT_SECRET,
      { subject: safeUser.id.toString(), expiresIn: Number(env.JWT_EXPIRES_IN) },
    );

    return reply.status(200).send({ data: {
      access_token: token,
      user: safeUser,
    }
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return reply.status(err.statusCode).send({
        error: {
          type: err.errorType,
          message: err.message,
        },
      });
    }

    request.log.error({ err }, 'authenticate_user_error');
    return reply.status(500).send({
      error: {
        type: 'internal_server_error',
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
