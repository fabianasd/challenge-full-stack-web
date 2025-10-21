import { AuthUserEntity } from '../../entities/auth-user';
import { DefaultGateway } from '../common/default.gateway';
import { CreateAuthUserGatewayInput } from './create-user.dto';

export interface CreateAuthUserGateway extends DefaultGateway {
  createUser(input: CreateAuthUserGatewayInput): Promise<AuthUserEntity>;
}
