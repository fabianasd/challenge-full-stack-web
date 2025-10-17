import { StudentEntity } from "../../entities/student";
import { type PersonWithStudent, UsersRepository } from "../../repositories/users-repository";
import { CommonGateway } from "../common/common.gateway";

export class ListStudentsGateway extends CommonGateway {
    constructor(private usersRepository: UsersRepository) {
        super();
    }
    
    async listAllStudents(): Promise<StudentEntity[]> {
        const users = await this.usersRepository.listAll();
        const students: StudentEntity[] = users
            .map((user) => new StudentEntity(user.fullName, user.email, user.document, user.student?.ra || ""));

        return students
    }
}
