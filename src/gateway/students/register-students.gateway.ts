import { StudentEntity } from "../../entities/student";
import { type PersonWithStudent, UsersRepository } from "../../repositories/users-repository";
import { CommonGateway } from "../common/common.gateway";
import { LokiLoggerService } from "../services/loki-logger.service";

export class RegisterStudentsGateway extends CommonGateway {
    constructor(
        private usersRepository: UsersRepository,
        protected lokiLoggerService: LokiLoggerService
    ) {
        super(lokiLoggerService);
    }

    public findStudentByDocument(cpf: string): Promise<StudentEntity | null> {
        return this.usersRepository.findByCPF(cpf);
    }

    findStudentByEmail(email: string): Promise<StudentEntity | null> {
        return this.usersRepository.findByEmail(email);
    }

    public async registerStudent(studentEntity: StudentEntity): Promise<StudentEntity | null> {
        return this.usersRepository.create(studentEntity)
    }
}
