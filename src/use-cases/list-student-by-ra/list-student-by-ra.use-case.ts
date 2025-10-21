import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';
import { StudentError } from '../../shared/errors/students.error';
import { LogType } from '../common/default.gateway';
import {
  ListStudentByRAInput,
  ListStudentByRAOutput,
} from './list-student-by-ra.dto';
import { ListStudentByRAGateway } from './list-student-by-ra.gateway';

export class ListStudentByRAUseCase {
  constructor(private listStudentByRAGateway: ListStudentByRAGateway) {}

  async execute({ ra }: ListStudentByRAInput): Promise<ListStudentByRAOutput> {
    const startDate = Date.now();
    try {
      const student = await this.listStudentByRAGateway.listStudentByRA(ra);

      if (!student) {
        throw new StudentError(
          ERROR_MESSAGES.STUDENT_NOT_FOUND,
          ERROR_TYPE.STUDENT_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      return { data: student };
    } catch (err) {
      this.listStudentByRAGateway.addLog(
        LogType.Error,
        'Error when list student',
        { err, milliseconds: Date.now() - startDate },
      );
      
      throw err;
    }
  }
}
