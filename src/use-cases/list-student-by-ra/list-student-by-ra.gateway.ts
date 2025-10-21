import { StudentEntity } from '../../entities/student';
import { DefaultGateway } from '../common/default.gateway';

export interface ListStudentByRAGateway extends DefaultGateway {
   listStudentByRA(ra: string): Promise<StudentEntity | null>;
}
