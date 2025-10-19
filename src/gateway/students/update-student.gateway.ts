import { StudentEntity } from '../../entities/student';
import { UsersRepository } from '../../repositories/users-repository';
import { CommonGateway } from '../common/common.gateway';
import { LokiLoggerService } from '../services/loki-logger.service';
import { UpdateStudentGateway as UpdateStudentInterfaceGateway } from '../../use-cases/update-student/update-student.gateway';

export class UpdateStudentGateway
  extends CommonGateway
  implements UpdateStudentInterfaceGateway
{
  constructor(
    private usersRepository: UsersRepository,
    protected lokiLoggerService: LokiLoggerService,
  ) {
    super(lokiLoggerService);
  }

  public updateByRa(student: StudentEntity): Promise<StudentEntity | null> {
    return this.usersRepository.updateEditable(student.ra, {
      email: student.email,
      name: student.name,
    });
  }
}
