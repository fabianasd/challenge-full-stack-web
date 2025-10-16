import { ERROR_MESSAGES, ERROR_TYPE, HTTP_STATUS } from "./error-messages";

export class StudentError extends Error {
    public errorType: ERROR_TYPE;
    public statusCode?: HTTP_STATUS;
    constructor(errorMessage: ERROR_MESSAGES, errorType: ERROR_TYPE, statusCode?: HTTP_STATUS) {
        super(errorMessage);
        this.errorType = errorType;
        this.statusCode = statusCode
    }
}

export class CpfAlreadyInUseError extends StudentError {
    constructor() {
        super(ERROR_MESSAGES.DOCUMENT_ALREADY_IN_USE, ERROR_TYPE.CPF_ALREADY_IN_USE, HTTP_STATUS.CONFLICT)
    }
}

export class UserAlreadyExistsError extends StudentError {
    constructor() {
        super(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE, ERROR_TYPE.STUDENT_ALREADY_REGISTERED, HTTP_STATUS.CONFLICT)
    }
}