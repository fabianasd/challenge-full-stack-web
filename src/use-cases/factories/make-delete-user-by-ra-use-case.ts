import { PrismaPersonRepository } from '../../repositories/prisma/prisma-person-repository';
import { DeleteUserByRAUseCase } from '../delete-student/delete-student.use-case';
import { LokiLoggerService } from '../../gateway/services/loki-logger.service';
import { DeleteStudentGateway } from '../../gateway/students/delete-student.gateway';
import { FastifyRequest } from 'fastify';

export function makeDeleteUserByRAUseCase(request: FastifyRequest) {
  const prismaPersonRepository = new PrismaPersonRepository();
  const lokiLoggerService = new LokiLoggerService(request.customLogger);
  const gateway = new DeleteStudentGateway(
    prismaPersonRepository,
    lokiLoggerService,
  );

  return new DeleteUserByRAUseCase(gateway);
}
