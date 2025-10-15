import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { GetUserByRAUseCase } from "../get-user-by-ra"

export function makeGetUserByRAUseCase() {
  const repo = new PrismaUsersRepository()
  return new GetUserByRAUseCase(repo)
}
