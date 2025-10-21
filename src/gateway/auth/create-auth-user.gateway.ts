import { Prisma } from '@prisma/client';
import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import type { AuthUsersRepository } from '../../repositories/auth-users-repository';
import type {
  CreateAuthUserGateway,
  CreateAuthUserGatewayInput,
} from '../../use-cases/create-user/create-user.gateway';
import { AuthError } from '../../shared/errors/auth.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';

export class CreateAuthUserPrismaGateway
  extends CommonGateway
  implements CreateAuthUserGateway
{
  constructor(
    private readonly authUsersRepository: AuthUsersRepository,
    lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  async createUser(input: CreateAuthUserGatewayInput) {
    try {
      return await this.authUsersRepository.create({
        fullName: input.fullName,
        email: input.email,
        document: input.document,
        passwordHash: input.passwordHash,
        roleNames: input.roles,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = Array.isArray(error.meta?.target)
          ? error.meta?.target[0]
          : error.meta?.target;

        if (target === 'person_email_key' || target === 'person_email_idx') {
          throw new AuthError(
            ERROR_MESSAGES.EMAIL_ALREADY_IN_USE,
            ERROR_TYPE.USER_EMAIL_ALREADY_IN_USE,
            HTTP_STATUS.CONFLICT,
          );
        }

        if (target === 'person_document_key') {
          throw new AuthError(
            ERROR_MESSAGES.DOCUMENT_ALREADY_IN_USE,
            ERROR_TYPE.CPF_ALREADY_IN_USE,
            HTTP_STATUS.CONFLICT,
          );
        }

        if (target === 'auth_user_email_key') {
          throw new AuthError(
            ERROR_MESSAGES.USER_EMAIL_ALREADY_IN_USE,
            ERROR_TYPE.USER_EMAIL_ALREADY_IN_USE,
            HTTP_STATUS.CONFLICT,
          );
        }
      }

      if (
        error instanceof Error &&
        (error.message.startsWith('Roles not found') ||
          error.message.includes('Roles not found'))
      ) {
        throw new AuthError(
          ERROR_MESSAGES.ROLE_NOT_FOUND,
          ERROR_TYPE.ROLE_NOT_FOUND,
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      throw error;
    }
  }
}
