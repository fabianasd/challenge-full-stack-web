import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { UpdateUserUseCase } from '../update-users'

export function makeUpdateUserUseCase() {
  const repo = new PrismaUsersRepository()
  return new UpdateUserUseCase(repo)
}
