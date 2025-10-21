import { ERROR_MESSAGES, ERROR_TYPE, HTTP_STATUS } from './error-messages';

export class AuthError extends Error {
  public errorType: ERROR_TYPE;
  public statusCode: HTTP_STATUS;

  constructor(
    message: ERROR_MESSAGES,
    errorType: ERROR_TYPE,
    statusCode: HTTP_STATUS,
  ) {
    super(message);
    this.errorType = errorType;
    this.statusCode = statusCode;
  }
}
