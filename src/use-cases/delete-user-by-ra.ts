import type { UsersRepository } from "../repositories/users-repository"
import { ResourceNotFoundError } from "./get-user-by-ra"

type DeleteUserByRARequest = {
  ra: string
}

export class DeleteUserByRAUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ ra }: DeleteUserByRARequest): Promise<void> {
    try {
      await this.usersRepository.deleteByRA(ra)
    } catch (err: any) {
      if (err?.message === 'NOT_FOUND') {
        throw new ResourceNotFoundError()
      }
      throw err
    }
  }
}
