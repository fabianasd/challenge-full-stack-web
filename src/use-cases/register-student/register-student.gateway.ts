import { StudentEntity } from '../../entities/student';
import { DefaultGateway } from '../common/default.gateway';

export interface RegisterStudentGateway extends DefaultGateway {
  registerStudent(studentEntity: StudentEntity): Promise<StudentEntity | null>;
  findStudentByDocument(cpf: string): Promise<StudentEntity | null>;
  findStudentByEmail(email: string): Promise<StudentEntity | null>;
}
