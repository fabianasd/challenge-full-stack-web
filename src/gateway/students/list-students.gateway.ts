import { StudentEntity } from "../../entities/student";
import { UsersRepository } from "../../repositories/users-repository";
import { CommonGateway } from "../common/common.gateway";
import { LokiLoggerService } from "../services/loki-logger.service";

export class ListStudentsGateway extends CommonGateway {
    constructor(
        private usersRepository: UsersRepository,
        protected lokiLoggerService: LokiLoggerService
    ) {
        super(lokiLoggerService);
    }
  
    async listAllStudents(): Promise<StudentEntity[]> {
        const users = await this.usersRepository.listAll();
        const students: StudentEntity[] = users
            .map((user) => new StudentEntity(user.fullName, user.email, user.document, user.student?.ra || ""));

        return students
    }
}