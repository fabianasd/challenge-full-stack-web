export enum ERROR_MESSAGES {
  ERROR_LISTING_STUDENT = 'Error when listing student',
  ERROR_REGISTERING_STUDENT = 'Error when registering a new student',
  DOCUMENT_ALREADY_IN_USE = 'Provided document is already being used',
  EMAIL_ALREADY_IN_USE = 'Provided e-mail is already being used',
  USER_EMAIL_ALREADY_IN_USE = 'User e-mail is already being used',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  STUDENT_NOT_FOUND = 'Student not found',
  USER_NOT_FOUND = 'User not found',
  INVALID_CREDENTIALS = 'Invalid credentials',
  ROLE_NOT_FOUND = 'Role not found',
  PERMISSION_NOT_FOUND = 'Permission not found',
  PERMISSION_DENIED = 'Permission denied',
}

export enum HTTP_STATUS {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ERROR_TYPE {
  LIST_STUDENT_ERROR = 'list_student_error',
  CPF_ALREADY_IN_USE = 'cpf_already_in_use',
  STUDENT_ALREADY_REGISTERED = 'student_already_registered',
  STUDENT_NOT_FOUND = 'student_not_found',
  USER_NOT_FOUND = 'user_not_found',
  INVALID_CREDENTIALS = 'invalid_credentials',
  ROLE_NOT_FOUND = 'role_not_found',
  PERMISSION_NOT_FOUND = 'permission_not_found',
  PERMISSION_DENIED = 'permission_denied',
  USER_EMAIL_ALREADY_IN_USE = 'user_email_already_in_use',
}
