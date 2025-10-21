import { FastifyRequest } from 'fastify';
import { PrismaAuthUsersRepository } from '../../repositories/prisma/prisma-auth-users-repository';
import { AuthenticateUserUseCase } from '../authenticate-user/authenticate-user.use-case';
import { AuthenticateUserPrismaGateway } from '../../gateway/auth/authenticate-user.gateway';
import { LokiLoggerService } from '../../gateway/services/loki-logger.service';

export function makeAuthenticateUserUseCase(request: FastifyRequest) {
  const authRepository = new PrismaAuthUsersRepository();
  const lokiLoggerService = new LokiLoggerService(request.customLogger);
  const gateway = new AuthenticateUserPrismaGateway(
    authRepository,
    lokiLoggerService,
  );

  return new AuthenticateUserUseCase(gateway);
}
