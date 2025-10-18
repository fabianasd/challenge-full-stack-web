import { PrismaPersonRepository } from '../../repositories/prisma/prisma-person-repository';
import { UpdateUserUseCase } from '../update-users';

export function makeUpdateUserUseCase() {
  const repo = new PrismaPersonRepository();
  return new UpdateUserUseCase(repo);
}
