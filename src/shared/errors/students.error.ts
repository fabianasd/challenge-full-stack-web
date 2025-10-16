import { ERROR_MESSAGES } from "./error-messages";

export class StudentError extends Error {
    public statusCode?: number;
    constructor(errorMessage: ERROR_MESSAGES, statusCode?: number) {
        super(errorMessage);
        this.statusCode = statusCode
    }
}