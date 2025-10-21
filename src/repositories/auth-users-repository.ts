import { AuthUserEntity } from '../entities/auth-user';

export type CreateAuthUserRepositoryInput = {
  fullName: string;
  email: string;
  document: string;
  passwordHash: string;
  roleNames: string[];
};

export interface AuthUsersRepository {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
  create(input: CreateAuthUserRepositoryInput): Promise<AuthUserEntity>;
}
