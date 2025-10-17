import { RegisterStudentGateway } from "./register-student.gateway"
import { StudentEntity } from "../../entities/student"
import { RegisterStudentInput, RegisterStudentOutput } from "./register-student.dto"
import { StudentError } from "../../shared/errors/students.error"
import { LogType } from "../common/default.gateway"
import { InternalServerError } from "../../shared/errors/default.error"
import { ERROR_MESSAGES, ERROR_TYPE, HTTP_STATUS } from "../../shared/errors/error-messages"

export class RegisterStudentUseCase {
    constructor(private registerStudentGateway: RegisterStudentGateway) { }

    async execute({ name, email, cpf, ra }: RegisterStudentInput): Promise<RegisterStudentOutput> {
        const startDate = Date.now();
        try {
            this.registerStudentGateway.addLog(LogType.Info, 'Searching for student by email', { email });
            const userWithSameEmail = await this.registerStudentGateway.findStudentByEmail(email)
            if (userWithSameEmail) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student with email already exists', { email, milliseconds: Date.now() - startDate });
                throw new StudentError(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE, ERROR_TYPE.STUDENT_ALREADY_REGISTERED, HTTP_STATUS.CONFLICT)
            }
            
            this.registerStudentGateway.addLog(LogType.Info, 'Searching for student by document', { cpf, milliseconds: Date.now() - startDate });
            const userWithSameCPF = await this.registerStudentGateway.findStudentByDocument(cpf)
            if (userWithSameCPF) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student with cpf already exists', { cpf, milliseconds: Date.now() - startDate });
                throw new StudentError(ERROR_MESSAGES.DOCUMENT_ALREADY_IN_USE, ERROR_TYPE.CPF_ALREADY_IN_USE, HTTP_STATUS.CONFLICT)
            }
            
            this.registerStudentGateway.addLog(LogType.Warn, 'Creating student', { milliseconds: Date.now() - startDate});
            const newStudent = new StudentEntity(name, email, cpf, ra);
            const student = await this.registerStudentGateway.registerStudent(newStudent);
            
            if(!student) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student could not be created', { milliseconds: Date.now() - startDate });
                throw new InternalServerError()
            }
            
            this.registerStudentGateway.addLog(LogType.Warn, 'Student created sucessfully', { milliseconds: Date.now() - startDate });
            return { data: student }
        } catch (err) {
            this.registerStudentGateway.addLog(LogType.Error, 'Error when registering a new student', { err, milliseconds: Date.now() - startDate })
            throw err
        }
    }
}
