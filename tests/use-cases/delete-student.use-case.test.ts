import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test } from 'node:test';

import type { DeleteStudentGateway } from '../../src/use-cases/delete-student/delete-student.gateway';
import { DeleteUserByRAUseCase } from '../../src/use-cases/delete-student/delete-student.use-case';
import type { DeleteStudentInput } from '../../src/use-cases/delete-student/delete-student.dto';
import { StudentError } from '../../src/shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../src/shared/errors/error-messages';
import { LogType } from '../../src/use-cases/common/default.gateway';

type GatewayMocks = {
  addLog: ReturnType<typeof mock.fn<DeleteStudentGateway['addLog']>>;
  deleteByRA: ReturnType<typeof mock.fn<DeleteStudentGateway['deleteByRA']>>;
};

function makeGateway(): DeleteStudentGateway & GatewayMocks {
  const addLog = mock.fn<DeleteStudentGateway['addLog']>();
  const deleteByRA = mock.fn<DeleteStudentGateway['deleteByRA']>();

  addLog.mock.mockImplementation(() => {});
  deleteByRA.mock.mockImplementation(async () => 1);

  return {
    addLog,
    deleteByRA,
  };
}

describe('DeleteStudentUseCase', () => {
  let gateway: ReturnType<typeof makeGateway>;
  let useCase: DeleteUserByRAUseCase;

  beforeEach(() => {
    gateway = makeGateway();
    useCase = new DeleteUserByRAUseCase(gateway);
  });

  function buildInput(
    overrides: Partial<DeleteStudentInput> = {},
  ): DeleteStudentInput {
    return { ra: '123456', ...overrides };
  }

  test('returns empty object when deletion succeeds', async () => {
    const result = await useCase.execute(buildInput());

    assert.deepEqual(result, {});
    assert.strictEqual(gateway.deleteByRA.mock.callCount(), 1);
  });

  test('throws StudentError when no student was removed', async () => {
    gateway.deleteByRA.mock.mockImplementationOnce(async () => 0);

    try {
      await useCase.execute(buildInput());
      assert.fail('expected StudentError when no student is deleted');
    } catch (error) {
      assert.ok(error instanceof StudentError);
      assert.strictEqual(error.message, ERROR_MESSAGES.STUDENT_NOT_FOUND);
      assert.strictEqual(error.errorType, ERROR_TYPE.STUDENT_NOT_FOUND);
      assert.strictEqual(error.statusCode, HTTP_STATUS.NOT_FOUND);
    }
    assert.strictEqual(gateway.deleteByRA.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Error && message === 'Error when delete student'
        );
      }),
    );
  });
});
