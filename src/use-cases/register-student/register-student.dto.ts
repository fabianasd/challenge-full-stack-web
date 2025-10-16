import { StudentEntity } from "../../entities/student"
import { StudentError } from "../../shared/errors/students.error";

export type RegisterStudentInput = {
    name: string
    email: string
    cpf: string
    ra: string
}

export type RegisterStudentOutput = {
    data?: StudentEntity,
    error?: StudentError
;}