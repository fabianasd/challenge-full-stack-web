import assert from 'node:assert/strict';
import { beforeEach, describe, mock, test } from 'node:test';

import type { ListStudentsGateway } from '../../src/use-cases/list-students/list-students.gateway';
import { ListStudentsUseCase } from '../../src/use-cases/list-students/list-students.use-case';
import { StudentEntity } from '../../src/entities/student';
import { StudentError } from '../../src/shared/errors/students.error';
import {
  ERROR_MESSAGES,
  ERROR_TYPE,
} from '../../src/shared/errors/error-messages';
import { LogType } from '../../src/use-cases/common/default.gateway';

type ListStudentsGatewayMocks = {
  addLog: ReturnType<typeof mock.fn<ListStudentsGateway['addLog']>>;
  listAllStudents: ReturnType<
    typeof mock.fn<ListStudentsGateway['listAllStudents']>
  >;
};

function makeGateway(): ListStudentsGatewayMocks & ListStudentsGateway {
  const addLog = mock.fn<ListStudentsGateway['addLog']>();
  const listAllStudents = mock.fn<ListStudentsGateway['listAllStudents']>();

  addLog.mock.mockImplementation(() => {});
  listAllStudents.mock.mockImplementation(async () => []);

  return {
    addLog,
    listAllStudents,
  };
}

describe('ListStudentsUseCase', () => {
  let gateway: ReturnType<typeof makeGateway>;
  let useCase: ListStudentsUseCase;

  beforeEach(() => {
    gateway = makeGateway();
    useCase = new ListStudentsUseCase(gateway);
  });

  test('returns all students successfully', async () => {
    const students = [
      new StudentEntity(
        'John Doe',
        'john@example.com',
        '12345678901',
        'RA123456',
      ),
      new StudentEntity(
        'Jane Roe',
        'jane@example.com',
        '10987654321',
        'RA654321',
      ),
    ];

    gateway.listAllStudents.mock.mockImplementationOnce(async () => students);

    const result = await useCase.execute();

    assert.deepEqual(result, { data: students });
    assert.strictEqual(gateway.listAllStudents.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Info && message === 'Student listed sucessfully'
        );
      }),
    );
  });

  test('returns error when the gateway throws', async () => {
    const gatewayError = new Error('database offline');
    gateway.listAllStudents.mock.mockImplementationOnce(async () => {
      throw gatewayError;
    });

    const result = await useCase.execute();

    assert.ok(result.error instanceof StudentError);
    assert.strictEqual(
      result.error.message,
      ERROR_MESSAGES.ERROR_LISTING_STUDENT,
    );
    assert.strictEqual(result.error.errorType, ERROR_TYPE.LIST_STUDENT_ERROR);
    assert.strictEqual(result.error.statusCode, 500);
    assert.strictEqual(gateway.listAllStudents.mock.callCount(), 1);
    assert.ok(
      gateway.addLog.mock.calls.some((call) => {
        const [type, message] = call.arguments;
        return (
          type === LogType.Error && message === 'Error when listing students'
        );
      }),
    );
  });
});
