import type { UsersRepository } from '../repositories/users-repository';
import type { Person } from '@prisma/client';

export class ResourceNotFoundError extends Error {}
export class EmailAlreadyInUseError extends Error {}
export class NoEditableFieldsError extends Error {}

type UpdateUserRequest = {
  ra: string;
  name?: string;
  email?: string;
};

type UpdateUserResponse = { user: Person };

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    ra,
    name,
    email,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    if (name === undefined && email === undefined) {
      throw new NoEditableFieldsError();
    }

    const student = await this.usersRepository.findByRA(ra);
    if (!student) {
      throw new ResourceNotFoundError();
    }

    const data: { name?: string; email?: string } = {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
    };

    try {
      const user = await this.usersRepository.updateEditable(
        student.person.personId,
        data,
      );
      return { user };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      if (message === 'NOT_FOUND') throw new ResourceNotFoundError();
      if (message === 'EMAIL_TAKEN') throw new EmailAlreadyInUseError();
      throw err;
    }
  }
}
