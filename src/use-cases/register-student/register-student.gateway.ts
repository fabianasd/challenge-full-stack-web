import { StudentEntity } from "../../entities/student";
import { DefaultGateway } from "../common/default.gateway";

export interface RegisterStudentGateway extends DefaultGateway {
    registerStudent(studentEntity: StudentEntity): Promise<StudentEntity>;
    findStudentByDocument(cpf: string): Promise<StudentEntity>;
    findStudentByEmail(email: string): Promise<StudentEntity>;
}