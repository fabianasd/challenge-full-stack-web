import { FastifyRequest } from 'fastify';
import { PrismaAuthUsersRepository } from '../../repositories/prisma/prisma-auth-users-repository';
import { CreateUserUseCase } from '../create-user/create-user.use-case';
import { CreateAuthUserPrismaGateway } from '../../gateway/auth/create-auth-user.gateway';
import { LokiLoggerService } from '../../gateway/services/loki-logger.service';

export function makeCreateUserUseCase(request: FastifyRequest) {
  const authRepository = new PrismaAuthUsersRepository();
  const lokiLoggerService = new LokiLoggerService(request.customLogger);
  const gateway = new CreateAuthUserPrismaGateway(
    authRepository,
    lokiLoggerService,
  );

  return new CreateUserUseCase(gateway);
}
