import { PrismaPersonRepository } from "../../repositories/prisma/prisma-person-repository"
import { DeleteUserByRAUseCase } from "../delete-user-by-ra"

export function makeDeleteUserByRAUseCase() {
  const repo = new PrismaPersonRepository()
  return new DeleteUserByRAUseCase(repo)
}
