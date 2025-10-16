import { RegisterStudentsGateway } from "../../gateway/students/register-students.gateway"
import { PrismaPersonRepository } from "../../repositories/prisma/prisma-person-repository"
import { RegisterStudentUseCase } from "../register-student/register-student.use-case"

export function makeRegisterStudentsUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const gateway = new RegisterStudentsGateway(prismaPersonRepository)
  // @ts-ignore
  return new RegisterStudentUseCase(gateway);
}
