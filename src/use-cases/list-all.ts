import type { UsersRepository } from '../repositories/users-repository.js'
import type { Person } from '@prisma/client'

type ListUsersResponse = { users: Person[] }

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<ListUsersResponse> {
    const users = await this.usersRepository.listAll()
    return { users }
  }
}
