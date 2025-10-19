import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test } from 'node:test';

import { StudentEntity } from '../../src/entities/student';
import type { UpdateStudentGateway } from '../../src/use-cases/update-student/update-student.gateway';
import { UpdateUserUseCase } from '../../src/use-cases/update-student/update-student.use-case';
import type { UpdateStudentInput } from '../../src/use-cases/update-student/update-student.dto';
import { StudentError } from '../../src/shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../src/shared/errors/error-messages';
import { LogType } from '../../src/use-cases/common/default.gateway';

type GatewayMocks = {
  addLog: ReturnType<typeof mock.fn<UpdateStudentGateway['addLog']>>;
  updateByRa: ReturnType<typeof mock.fn<UpdateStudentGateway['updateByRa']>>;
};

function makeGateway(): UpdateStudentGateway & GatewayMocks {
  const addLog = mock.fn<UpdateStudentGateway['addLog']>();
  const updateByRa = mock.fn<UpdateStudentGateway['updateByRa']>();

  addLog.mock.mockImplementation(() => {});
  updateByRa.mock.mockImplementation(async (student) => student);

  return {
    addLog,
    updateByRa,
  };
}

describe('UpdateUserUseCase', () => {
  let gateway: ReturnType<typeof makeGateway>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    gateway = makeGateway();
    useCase = new UpdateUserUseCase(gateway);
  });

  function buildInput(
    overrides: Partial<UpdateStudentInput> = {},
  ): UpdateStudentInput {
    return {
      ra: '123456',
      name: 'Updated Name',
      email: 'updated@example.com',
      ...overrides,
    };
  }

  test('returns the updated student when the gateway succeeds', async () => {
    const result = await useCase.execute(buildInput());

    assert.ok(result.data instanceof StudentEntity);
    assert.strictEqual(result.data?.name, 'Updated Name');
    assert.strictEqual(result.data?.email, 'updated@example.com');
    assert.strictEqual(result.data?.ra, '123456');
    assert.strictEqual(gateway.updateByRa.mock.callCount(), 1);
  });

  test('throws StudentError when the gateway cannot update the student', async () => {
    gateway.updateByRa.mock.mockImplementationOnce(async () => null);

    try {
      await useCase.execute(buildInput());
      assert.fail('expected StudentError when update fails');
    } catch (error) {
      assert.ok(error instanceof StudentError);
      assert.strictEqual(error.message, ERROR_MESSAGES.STUDENT_NOT_FOUND);
      assert.strictEqual(error.errorType, ERROR_TYPE.STUDENT_NOT_FOUND);
      assert.strictEqual(error.statusCode, HTTP_STATUS.NOT_FOUND);
    }
    assert.strictEqual(gateway.updateByRa.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Error && message === 'Error when update a student'
        );
      }),
    );
  });

  test('fills missing optional fields with empty strings before updating', async () => {
    gateway.updateByRa.mock.mockImplementationOnce(async (student) => student);

    const input = buildInput({ name: undefined, email: undefined });
    const result = await useCase.execute(input);

    assert.ok(result.data instanceof StudentEntity);
    assert.strictEqual(result.data?.name, '');
    assert.strictEqual(result.data?.email, '');
    assert.strictEqual(result.data?.ra, input.ra);
    assert.strictEqual(gateway.updateByRa.mock.callCount(), 1);
    const [studentArg] = gateway.updateByRa.mock.calls[0].arguments;
    assert.ok(studentArg instanceof StudentEntity);
    assert.strictEqual(studentArg.name, '');
    assert.strictEqual(studentArg.email, '');
  });

  test('propagates unexpected errors from the gateway while logging them', async () => {
    const gatewayError = new Error('database offline');
    gateway.updateByRa.mock.mockImplementationOnce(async () => {
      throw gatewayError;
    });

    try {
      await useCase.execute(buildInput());
      assert.fail('expected gateway error to be rethrown');
    } catch (error) {
      assert.strictEqual(error, gatewayError);
    }
    assert.strictEqual(gateway.updateByRa.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Error && message === 'Error when update a student'
        );
      }),
    );
  });
});
