import type { UsersRepository } from '../repositories/users-repository';

export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found');
  }
}

interface GetUserByRARequest {
  ra: string;
}

export class GetUserByRAUseCase {
  constructor(private studentRepository: UsersRepository) {}

  async execute({ ra }: GetUserByRARequest) {
    const user = await this.studentRepository.findByRA(ra);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
