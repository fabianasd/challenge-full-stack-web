import { FastifyRequest } from 'fastify';
import { PrismaPersonRepository } from '../../repositories/prisma/prisma-person-repository';
import { LokiLoggerService } from '../../gateway/services/loki-logger.service';
import { ListStudentByRAGateway } from '../../gateway/students/list-student-by-ra.gateway';
import { ListStudentByRAUseCase } from '../list-student-by-ra/list-student-by-ra.use-case';

export function makeListUserByRAUseCase(request: FastifyRequest) {
  const prismaPersonRepository = new PrismaPersonRepository();
    const lokiLoggerService = new LokiLoggerService(request.customLogger);
    const gateway = new ListStudentByRAGateway(
      prismaPersonRepository,
      lokiLoggerService,
    );
    
  return new ListStudentByRAUseCase(gateway);
}
