import { UsersRepository } from '../../repositories/users-repository';
import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import { DeleteStudentGateway as DeleteStudentInterfaceGateway } from '../../use-cases/delete-student/delete-student.gateway';

export class DeleteStudentGateway
  extends CommonGateway
  implements DeleteStudentInterfaceGateway
{
  constructor(
    private usersRepository: UsersRepository,
    protected lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  async deleteByRA(ra: string): Promise<number> {
    return this.usersRepository.deleteByRA(ra);
  }
}
