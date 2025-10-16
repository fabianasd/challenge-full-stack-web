import { ListStudentsGateway } from "../../gateway/students/list-students.gateway"
import { PrismaPersonRepository } from "../../repositories/prisma/prisma-person-repository"
import { ListStudentsUseCase } from '../list-students/list-students.use-case'

export function makeListUsersUseCase() {
  const prismaPersonRepository = new PrismaPersonRepository()
  const gateway = new ListStudentsGateway(prismaPersonRepository)
  // @ts-ignore
  return new ListStudentsUseCase(gateway);
}
