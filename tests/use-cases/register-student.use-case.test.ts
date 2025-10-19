import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test } from 'node:test';

import type { RegisterStudentInput } from '../../src/use-cases/register-student/register-student.dto';
import type { RegisterStudentGateway } from '../../src/use-cases/register-student/register-student.gateway';
import { RegisterStudentUseCase } from '../../src/use-cases/register-student/register-student.use-case';
import { StudentEntity } from '../../src/entities/student';
import { InternalServerError } from '../../src/shared/errors/default.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
} from '../../src/shared/errors/error-messages';
import { StudentError } from '../../src/shared/errors/students.error';
import { LogType } from '../../src/use-cases/common/default.gateway';

let gateway: {
  addLog: ReturnType<typeof mock.fn<RegisterStudentGateway['addLog']>>;
  findStudentByEmail: ReturnType<
    typeof mock.fn<RegisterStudentGateway['findStudentByEmail']>
  >;
  findStudentByDocument: ReturnType<
    typeof mock.fn<RegisterStudentGateway['findStudentByDocument']>
  >;
  registerStudent: ReturnType<
    typeof mock.fn<RegisterStudentGateway['registerStudent']>
  >;
};
let useCase: RegisterStudentUseCase;

function buildInput(
  overrides: Partial<RegisterStudentInput> = {},
): RegisterStudentInput {
  return {
    name: 'John Doe',
    email: 'john.doe@example.com',
    cpf: '12345678901',
    ra: 'RA123456',
    ...overrides,
  };
}

describe('RegisterStudentUseCase', () => {
  beforeEach(() => {
    gateway = {
      addLog: mock.fn<RegisterStudentGateway['addLog']>(),
      findStudentByEmail:
        mock.fn<RegisterStudentGateway['findStudentByEmail']>(),
      findStudentByDocument:
        mock.fn<RegisterStudentGateway['findStudentByDocument']>(),
      registerStudent: mock.fn<RegisterStudentGateway['registerStudent']>(),
    };

    // default no-op implementations
    gateway.addLog.mock.mockImplementation(() => {});
    gateway.findStudentByEmail.mock.mockImplementation(async () => null);
    gateway.findStudentByDocument.mock.mockImplementation(async () => null);
    gateway.registerStudent.mock.mockImplementation(async (student) => student);

    useCase = new RegisterStudentUseCase(gateway);
  });

  test('returns the persisted student when registration succeeds', async () => {
    const persistedStudent = new StudentEntity(
      'John Doe',
      'john.doe@example.com',
      '12345678901',
      'RA123456',
    );

    gateway.registerStudent.mock.mockImplementationOnce(
      async () => persistedStudent,
    );

    const input = buildInput();
    const result = await useCase.execute(input);

    assert.deepEqual(result, { data: persistedStudent });
    assert.strictEqual(gateway.registerStudent.mock.callCount(), 1);
    const [storedStudent] = gateway.registerStudent.mock.calls[0].arguments;
    assert.ok(storedStudent instanceof StudentEntity);
    assert.strictEqual(storedStudent.name, input.name);
    assert.strictEqual(storedStudent.email, input.email);
    assert.strictEqual(storedStudent.document, input.cpf);
    assert.strictEqual(storedStudent.ra, input.ra);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Warn && message === 'Student created sucessfully'
        );
      }),
    );
  });

  test('throws StudentError when the e-mail is already registered', async () => {
    const existingStudent = new StudentEntity(
      'Existing Student',
      'john.doe@example.com',
      '98765432100',
      'RA999999',
    );

    gateway.findStudentByEmail.mock.mockImplementationOnce(
      async () => existingStudent,
    );

    try {
      await useCase.execute(buildInput());
      assert.fail(
        'expected StudentError to be thrown when e-mail already exists',
      );
    } catch (error) {
      assert.ok(error instanceof StudentError);
      assert.strictEqual(error.message, ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
      assert.strictEqual(
        error.errorType,
        ERROR_TYPE.STUDENT_ALREADY_REGISTERED,
      );
    }
    assert.strictEqual(gateway.registerStudent.mock.callCount(), 0);
  });

  test('throws StudentError when the cpf is already registered', async () => {
    const existingStudent = new StudentEntity(
      'Existing Student',
      'existing@example.com',
      '12345678901',
      'RA999999',
    );

    gateway.findStudentByDocument.mock.mockImplementationOnce(
      async () => existingStudent,
    );

    try {
      await useCase.execute(buildInput());
      assert.fail('expected StudentError to be thrown when CPF already exists');
    } catch (error) {
      assert.ok(error instanceof StudentError);
      assert.strictEqual(error.message, ERROR_MESSAGES.DOCUMENT_ALREADY_IN_USE);
      assert.strictEqual(error.errorType, ERROR_TYPE.CPF_ALREADY_IN_USE);
    }
    assert.strictEqual(gateway.registerStudent.mock.callCount(), 0);
  });

  test('throws InternalServerError when the gateway cannot persist the student', async () => {
    gateway.registerStudent.mock.mockImplementationOnce(async () => null);

    try {
      await useCase.execute(buildInput());
      assert.fail('expected InternalServerError to be thrown');
    } catch (error) {
      assert.ok(error instanceof InternalServerError);
    }
    assert.strictEqual(gateway.registerStudent.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Warn && message === 'Student could not be created'
        );
      }),
    );
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Error &&
          message === 'Error when registering a new student'
        );
      }),
    );
  });
});
