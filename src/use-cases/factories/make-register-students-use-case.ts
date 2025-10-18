import { FastifyRequest } from "fastify"
import { LokiLoggerService } from "../../gateway/services/loki-logger.service"
import { RegisterStudentsGateway } from "../../gateway/students/register-students.gateway"
import { PrismaPersonRepository } from "../../repositories/prisma/prisma-person-repository"
import { RegisterStudentUseCase } from "../register-student/register-student.use-case"

export function makeRegisterStudentsUseCase(request: FastifyRequest) {
  const prismaPersonRepository = new PrismaPersonRepository()
  const lokiLoggerService = new LokiLoggerService(request.customLogger)
  const gateway = new RegisterStudentsGateway(prismaPersonRepository, lokiLoggerService)
  // @ts-ignore
  return new RegisterStudentUseCase(gateway);
}
