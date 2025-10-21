import { AuthUserEntity } from '../../entities/auth-user';
import { AuthError } from '../../shared/errors/auth.error';

export type AuthenticateUserInput = {
  email: string;
  password: string;
};

export type AuthenticateUserOutput = {
  data?: AuthUserEntity;
  error?: AuthError;
};
