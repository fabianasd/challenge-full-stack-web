import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import type { AuthUsersRepository } from '../../repositories/auth-users-repository';
import type { AuthenticateUserGateway } from '../../use-cases/authenticate-user/authenticate-user.gateway';
import { verifyPassword } from '../../shared/security/password';

export class AuthenticateUserPrismaGateway
  extends CommonGateway
  implements AuthenticateUserGateway
{
  constructor(
    private readonly authUsersRepository: AuthUsersRepository,
    lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  findByEmail(email: string) {
    return this.authUsersRepository.findByEmail(email);
  }

  verifyPassword(password: string, passwordHash: string) {
    return verifyPassword(password, passwordHash);
  }
}
