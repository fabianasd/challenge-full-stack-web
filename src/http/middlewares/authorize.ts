import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../env';
import { verifyJwt } from '../../shared/security/jwt';
import { ERROR_MESSAGES, ERROR_TYPE, HTTP_STATUS } from '../../shared/errors/error-messages';

interface JwtPayload {
  sub?: string;
  email?: string;
  permissions?: string[];
  roles?: string[];
}

function extractBearerToken(authorization?: string) {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

export function authorize(requiredPermission?: string) {
  return async function authorizeMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: {
          type: ERROR_TYPE.INVALID_CREDENTIALS,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        },
      });
    }

    try {
      const { payload } = verifyJwt<JwtPayload>(token, env.JWT_SECRET);

      const userId = payload.sub ? Number(payload.sub) : undefined;
      const permissions = payload.permissions ?? [];
      const roles = payload.roles ?? [];

      if (!userId || Number.isNaN(userId)) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
          error: {
            type: ERROR_TYPE.INVALID_CREDENTIALS,
            message: ERROR_MESSAGES.INVALID_CREDENTIALS,
          },
        });
      }

      if (
        requiredPermission &&
        !permissions.includes(requiredPermission)
      ) {
        return reply.status(HTTP_STATUS.FORBIDDEN).send({
          error: {
            type: ERROR_TYPE.PERMISSION_DENIED,
            message: ERROR_MESSAGES.PERMISSION_DENIED,
          },
        });
      }

      request.user = {
        id: userId,
        email: payload.email ?? '',
        permissions,
        roles,
      };
    } catch (err) {
      request.log.warn({ err }, 'authorize_middleware_error');
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: {
          type: ERROR_TYPE.INVALID_CREDENTIALS,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        },
      });
    }
  };
}
