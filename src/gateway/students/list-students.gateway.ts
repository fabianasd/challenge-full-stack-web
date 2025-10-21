import { StudentEntity } from '../../entities/student';
import { UsersRepository } from '../../repositories/users-repository';
import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import { ListStudentsGateway as ListStudentsInterfaceGateway } from '../../use-cases/list-students/list-students.gateway';

export class ListStudentsGateway
  extends CommonGateway
  implements ListStudentsInterfaceGateway
{
  constructor(
    private usersRepository: UsersRepository,
    protected lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  public async listAllStudents(): Promise<StudentEntity[]> {
    return await this.usersRepository.listAll() as StudentEntity[];
  }
}
