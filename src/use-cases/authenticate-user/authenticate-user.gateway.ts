import { AuthUserEntity } from '../../entities/auth-user';
import { DefaultGateway } from '../common/default.gateway';

export interface AuthenticateUserGateway extends DefaultGateway {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
  verifyPassword(password: string, passwordHash: string): Promise<boolean>;
}
