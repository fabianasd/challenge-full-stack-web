import { LogType } from '../common/default.gateway';
import { DeleteStudentGateway } from './delete-student.gateway';
import { DeleteStudentInput, DeleteStudentOutput } from './delete-student.dto';
import { StudentError } from '../../shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';

export class DeleteUserByRAUseCase {
  constructor(private deleteStudentGateway: DeleteStudentGateway) {}

  async execute({ ra }: DeleteStudentInput): Promise<DeleteStudentOutput> {
    const startDate = Date.now();
    try {
      const numberOfDeletedStudents =
        await this.deleteStudentGateway.deleteByRA(ra);

      if (!numberOfDeletedStudents) {
        throw new StudentError(
          ERROR_MESSAGES.STUDENT_NOT_FOUND,
          ERROR_TYPE.STUDENT_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      return {};
    } catch (err) {
      this.deleteStudentGateway.addLog(
        LogType.Error,
        'Error when registering a new student',
        { err, milliseconds: Date.now() - startDate },
      );
      throw err;
    }
  }
}
