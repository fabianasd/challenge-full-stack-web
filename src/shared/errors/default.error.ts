import { ERROR_MESSAGES, HTTP_STATUS } from './error-messages';

export class InternalServerError extends Error {
  public statusCode?: HTTP_STATUS;
  constructor() {
    super(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    this.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}
