import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { ListUsersUseCase } from '../list-all'

export function makeListUsersUseCase() {
  const repo = new PrismaUsersRepository()
  return new ListUsersUseCase(repo)
}
