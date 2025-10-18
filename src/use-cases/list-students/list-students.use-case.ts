import { ListStudentsGateway } from './list-students.gateway'
import { ListStudentOutput } from './list-students.dto';
import { LogType } from '../common/default.gateway';
import { StudentError } from '../../shared/errors/students.error';
import { ERROR_MESSAGES, ERROR_TYPE } from '../../shared/errors/error-messages';

export class ListStudentsUseCase {
  constructor(private listStudentsGateway: ListStudentsGateway) {}

  async execute(): Promise<ListStudentOutput> {
    const startDate = Date.now()
    try {
      const students = await this.listStudentsGateway.listAllStudents()

      this.listStudentsGateway.addLog(LogType.Info, 'Student listed sucessfully', {milliseconds: Date.now() - startDate})
      return {
        data: students
      }
    } catch(err) {
      this.listStudentsGateway.addLog(LogType.Error, 'Error when listing students', { err })

      return {
        error: new StudentError(ERROR_MESSAGES.ERROR_LISTING_STUDENT, ERROR_TYPE.LIST_STUDENT_ERROR, 500)
      }
    }
  }
}
