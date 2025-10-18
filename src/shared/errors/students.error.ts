import { ERROR_MESSAGES, ERROR_TYPE, HTTP_STATUS } from './error-messages';

export class StudentError extends Error {
  public errorType: ERROR_TYPE;
  public statusCode?: HTTP_STATUS;
  constructor(
    errorMessage: ERROR_MESSAGES,
    errorType: ERROR_TYPE,
    statusCode?: HTTP_STATUS,
  ) {
    super(errorMessage);
    this.errorType = errorType;
    this.statusCode = statusCode;
  }
}
