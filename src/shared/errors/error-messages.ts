export enum ERROR_MESSAGES {
  ERROR_LISTING_STUDENT = 'Error when listing student',
  ERROR_REGISTERING_STUDENT = 'Error when registering a new student',
  DOCUMENT_ALREADY_IN_USE = 'Provided document is already being used',
  EMAIL_ALREADY_IN_USE = 'Provided e-mail is already being used',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  STUDENT_NOT_FOUND = 'Student not found',
}

export enum HTTP_STATUS {
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ERROR_TYPE {
  LIST_STUDENT_ERROR = 'list_student_error',
  CPF_ALREADY_IN_USE = 'cpf_already_in_use',
  STUDENT_ALREADY_REGISTERED = 'student_already_registered',
  STUDENT_NOT_FOUND = 'student_not_found',
}
