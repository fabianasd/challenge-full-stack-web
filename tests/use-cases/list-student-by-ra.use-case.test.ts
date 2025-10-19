import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test } from 'node:test';

import type { ListStudentByRAInput } from '../../src/use-cases/list-student-by-ra/list-student-by-ra.dto';
import type { ListStudentByRAGateway } from '../../src/use-cases/list-student-by-ra/list-student-by-ra.gateway';
import { ListStudentByRAUseCase } from '../../src/use-cases/list-student-by-ra/list-student-by-ra.use-case';
import type { StudentWithPerson } from '../../src/repositories/users-repository';
import { StudentError } from '../../src/shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
  HTTP_STATUS,
} from '../../src/shared/errors/error-messages';
import { LogType } from '../../src/use-cases/common/default.gateway';

type GatewayMocks = {
  addLog: ReturnType<typeof mock.fn<ListStudentByRAGateway['addLog']>>;
  listStudentByRA: ReturnType<
    typeof mock.fn<ListStudentByRAGateway['listStudentByRA']>
  >;
};

function makeGateway(): ListStudentByRAGateway & GatewayMocks {
  const addLog = mock.fn<ListStudentByRAGateway['addLog']>();
  const listStudentByRA = mock.fn<ListStudentByRAGateway['listStudentByRA']>();

  addLog.mock.mockImplementation(() => {});
  listStudentByRA.mock.mockImplementation(async () => null);

  return {
    addLog,
    listStudentByRA,
  };
}

describe('ListStudentByRAUseCase', () => {
  let gateway: ReturnType<typeof makeGateway>;
  let useCase: ListStudentByRAUseCase;

  beforeEach(() => {
    gateway = makeGateway();
    useCase = new ListStudentByRAUseCase(gateway);
  });

  function buildInput(
    overrides: Partial<ListStudentByRAInput> = {},
  ): ListStudentByRAInput {
    return { ra: 'RA123456', ...overrides };
  }

  test('returns the student successfully', async () => {
    const student = { ra: 'RA123456' } as unknown as StudentWithPerson;
    gateway.listStudentByRA.mock.mockImplementationOnce(async () => student);

    const result = await useCase.execute(buildInput());

    assert.deepEqual(result, { student });
    assert.strictEqual(gateway.listStudentByRA.mock.callCount(), 1);
  });

  test('throws StudentError when the student is not found', async () => {
    try {
      await useCase.execute(buildInput());
      assert.fail('expected StudentError when student is missing');
    } catch (error) {
      assert.ok(error instanceof StudentError);
      assert.strictEqual(error.message, ERROR_MESSAGES.STUDENT_NOT_FOUND);
      assert.strictEqual(error.errorType, ERROR_TYPE.STUDENT_NOT_FOUND);
      assert.strictEqual(error.statusCode, HTTP_STATUS.NOT_FOUND);
    }
    assert.strictEqual(gateway.listStudentByRA.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return type === LogType.Error && message === 'Error when list student';
      }),
    );
  });
});
