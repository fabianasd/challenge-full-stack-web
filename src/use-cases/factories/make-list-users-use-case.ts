import { ListStudentsGateway } from "../../gateway/students/list-students.gateway"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { ListStudentsUseCase } from '../list-students/list-students.use-case'

export function makeListUsersUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const gateway = new ListStudentsGateway(prismaUsersRepository)
  // @ts-ignore
  return new ListStudentsUseCase(gateway);
}
