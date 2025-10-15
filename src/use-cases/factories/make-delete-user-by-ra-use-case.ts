import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { DeleteUserByRAUseCase } from "../delete-user-by-ra"

export function makeDeleteUserByRAUseCase() {
  const repo = new PrismaUsersRepository()
  return new DeleteUserByRAUseCase(repo)
}
