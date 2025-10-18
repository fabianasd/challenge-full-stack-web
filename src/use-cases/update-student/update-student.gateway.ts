import { StudentEntity } from '../../entities/student';
import { DefaultGateway } from '../common/default.gateway';

export interface UpdateStudentGateway extends DefaultGateway {
    updateByRa(student: StudentEntity): Promise<StudentEntity | null>;
}
