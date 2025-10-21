import { hashPassword } from '../../shared/security/password';
import { LogType } from '../common/default.gateway';
import type { CreateAuthUserGateway } from './create-user.gateway';
import type { CreateUserInput, CreateUserOutput } from './create-user.dto';

export class CreateUserUseCase {
  constructor(private readonly gateway: CreateAuthUserGateway) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const startAt = Date.now();

    try {
      this.gateway.addLog(LogType.Info, 'Hashing password for new auth user', {
        email: input.email,
      });
      const passwordHash = await hashPassword(input.password);

      this.gateway.addLog(LogType.Info, 'Creating auth user', {
        email: input.email,
        roles: input.roles,
      });

      const user = await this.gateway.createUser({
        fullName: input.fullName,
        email: input.email,
        document: input.document,
        passwordHash,
        roles: input.roles,
      });

      this.gateway.addLog(LogType.Info, 'Auth user created', {
        userId: user.id,
        milliseconds: Date.now() - startAt,
      });

      return { data: user };
    } catch (error) {
      this.gateway.addLog(LogType.Error, 'Error creating auth user', {
        error,
        milliseconds: Date.now() - startAt,
      });

      throw error;
    }
  }
}
