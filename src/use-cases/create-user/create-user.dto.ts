import { AuthUserEntity } from '../../entities/auth-user';
import { AuthError } from '../../shared/errors/auth.error';

export type CreateUserInput = {
  fullName: string;
  email: string;
  document: string;
  password: string;
  roles: string[];
};

export type CreateUserOutput = {
  data?: AuthUserEntity;
  error?: AuthError;
};

export type CreateAuthUserGatewayInput = {
  fullName: string;
  email: string;
  document: string;
  passwordHash: string;
  roles: string[];
};