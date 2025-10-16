import { StudentEntity } from "../../entities/student";
import { DefaultGateway } from "../common/default.gateway";

export interface ListStudentsGateway extends DefaultGateway {
    listAllStudents(): StudentEntity[];
}