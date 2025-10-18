import { DefaultGateway } from '../common/default.gateway';

export interface DeleteStudentGateway extends DefaultGateway {
  deleteByRA(ra: string): Promise<number>;
}
