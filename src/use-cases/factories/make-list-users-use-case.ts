import { FastifyRequest } from "fastify"
import { LokiLoggerService } from "../../gateway/services/loki-logger.service"
import { ListStudentsGateway } from "../../gateway/students/list-students.gateway"
import { PrismaPersonRepository } from "../../repositories/prisma/prisma-person-repository"
import { ListStudentsUseCase } from '../list-students/list-students.use-case'

export function makeListUsersUseCase(request: FastifyRequest) {
  const prismaPersonRepository = new PrismaPersonRepository()
  const lokiLoggerService = new LokiLoggerService(request.customLogger)
  const gateway = new ListStudentsGateway(prismaPersonRepository, lokiLoggerService)
  // @ts-ignore
  return new ListStudentsUseCase(gateway);
}
