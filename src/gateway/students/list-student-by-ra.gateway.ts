import {
  StudentWithPerson,
  UsersRepository,
} from '../../repositories/users-repository';
import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import { ListStudentByRAGateway as ListStudentByRAInterfaceGateway } from '../../use-cases/list-student-by-ra/list-student-by-ra.gateway';

export class ListStudentByRAGateway
  extends CommonGateway
  implements ListStudentByRAInterfaceGateway
{
  constructor(
    private usersRepository: UsersRepository,
    protected lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  async listStudentByRA(ra: string): Promise<StudentWithPerson | null> {
    return this.usersRepository.findByRA(ra);
  }
}
