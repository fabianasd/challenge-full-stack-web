import { PrismaPersonRepository } from '../../repositories/prisma/prisma-person-repository';
import { GetUserByRAUseCase } from '../get-user-by-ra';

export function makeGetUserByRAUseCase() {
  const repo = new PrismaPersonRepository();
  return new GetUserByRAUseCase(repo);
}
