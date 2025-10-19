import { StudentWithPerson } from '../../repositories/users-repository';
import { DefaultGateway } from '../common/default.gateway';

export interface ListStudentByRAGateway extends DefaultGateway {
   listStudentByRA(ra: string): Promise<StudentWithPerson | null>;
}
