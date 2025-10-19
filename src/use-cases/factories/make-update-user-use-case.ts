import { FastifyRequest } from 'fastify';
import { PrismaPersonRepository } from '../../repositories/prisma/prisma-person-repository';
import { UpdateUserUseCase } from '../update-student/update-student.use-case';
import { LokiLoggerService } from '../../gateway/services/loki-logger.service';
import { UpdateStudentGateway } from '../../gateway/students/update-student.gateway';

export function makeUpdateUserUseCase(request: FastifyRequest) {
  const prismaPersonRepository = new PrismaPersonRepository();
  const lokiLoggerService = new LokiLoggerService(request.customLogger);
  const gateway = new UpdateStudentGateway(
    prismaPersonRepository,
    lokiLoggerService,
  );
  return new UpdateUserUseCase(gateway);
}
