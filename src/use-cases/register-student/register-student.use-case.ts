import { RegisterStudentGateway } from "./register-student.gateway"
import { StudentEntity } from "../../entities/student"
import { RegisterStudentInput, RegisterStudentOutput } from "./register-student.dto"
import { CpfAlreadyInUseError, UserAlreadyExistsError } from "../../shared/errors/students.error"
import { LogType } from "../common/default.gateway"
import { InternalServerError } from "../../shared/errors/default.error"

export class RegisterStudentUseCase {
    constructor(private registerStudentGateway: RegisterStudentGateway) { }

    async execute({ name, email, cpf, ra }: RegisterStudentInput): Promise<RegisterStudentOutput> {
        try {
            this.registerStudentGateway.addLog(LogType.Info, 'Searching for student by email', { email });
            const userWithSameEmail = await this.registerStudentGateway.findStudentByEmail(email)
            if (userWithSameEmail) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student with email already exists', { email });
                throw new UserAlreadyExistsError()
            }
            
            this.registerStudentGateway.addLog(LogType.Info, 'Searching for student by document', { cpf });
            const userWithSameCPF = await this.registerStudentGateway.findStudentByDocument(cpf)
            if (userWithSameCPF) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student with cpf already exists', { cpf });
                throw new CpfAlreadyInUseError()
            }
            
            this.registerStudentGateway.addLog(LogType.Warn, 'Creating student');
            const newStudent = new StudentEntity(name, email, cpf, ra);
            const student = await this.registerStudentGateway.registerStudent(newStudent);
            
            if(!student) {
                this.registerStudentGateway.addLog(LogType.Warn, 'Student could not be created');
                throw new InternalServerError()
            }
            
            this.registerStudentGateway.addLog(LogType.Warn, 'Student created sucessfully');
            return { data: student }
        } catch (err) {
            this.registerStudentGateway.addLog(LogType.Error, 'Error when registering a new student', { err })
            throw err
        }
    }
}
