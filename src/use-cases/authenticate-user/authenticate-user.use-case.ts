import { AuthError } from '../../shared/errors/auth.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';
import { LogType } from '../common/default.gateway';
import type { AuthenticateUserGateway } from './authenticate-user.gateway';
import type {
  AuthenticateUserInput,
  AuthenticateUserOutput,
} from './authenticate-user.dto';

export class AuthenticateUserUseCase {
  constructor(private readonly gateway: AuthenticateUserGateway) {}

  async execute(
    input: AuthenticateUserInput,
  ): Promise<AuthenticateUserOutput> {
    const startAt = Date.now();

    try {
      this.gateway.addLog(LogType.Info, 'Searching auth user by email', {
        email: input.email,
      });

      const user = await this.gateway.findByEmail(input.email);

      if (!user || !user.isActive) {
        this.gateway.addLog(LogType.Warn, 'Auth user not found or inactive', {
          email: input.email,
          milliseconds: Date.now() - startAt,
        });

        throw new AuthError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          ERROR_TYPE.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED,
        );
      }

      const isValidPassword = await this.gateway.verifyPassword(
        input.password,
        user.passwordHash,
      );

      if (!isValidPassword) {
        this.gateway.addLog(LogType.Warn, 'Invalid credentials provided', {
          email: input.email,
          milliseconds: Date.now() - startAt,
        });

        throw new AuthError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          ERROR_TYPE.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED,
        );
      }

      this.gateway.addLog(LogType.Info, 'Auth user authenticated', {
        userId: user.id,
        milliseconds: Date.now() - startAt,
      });

      return { data: user };
    } catch (error) {
      this.gateway.addLog(LogType.Error, 'Error authenticating user', {
        error,
        milliseconds: Date.now() - startAt,
      });

      throw error;
    }
  }
}
