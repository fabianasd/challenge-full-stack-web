import { StudentEntity } from '../../entities/student';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../shared/errors/error-messages';
import { StudentError } from '../../shared/errors/students.error';
import { UpdateStudentInput, UpdateStudentOutput } from './update-student.dto';
import { UpdateStudentGateway } from './update-student.gateway';
import { LogType } from '../common/default.gateway';

export class UpdateUserUseCase {
  constructor(private updateStudentGateway: UpdateStudentGateway) {}

  async execute({
    ra,
    name,
    email,
  }: UpdateStudentInput): Promise<UpdateStudentOutput> {
    const startDate = Date.now();

    try {
      let studentEntity;
      studentEntity = new StudentEntity(name || '', email || '', '', ra);
      studentEntity = await this.updateStudentGateway.updateByRa(studentEntity);
      if (!studentEntity) {
        throw new StudentError(
          ERROR_MESSAGES.STUDENT_NOT_FOUND,
          ERROR_TYPE.STUDENT_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }
      return { data: studentEntity };
    } catch (err) {
      this.updateStudentGateway.addLog(
        LogType.Error,
        'Error when update a student',
        { err, milliseconds: Date.now() - startDate },
      );
      throw err;
    }
  }
}
