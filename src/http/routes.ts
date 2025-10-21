import type { FastifyInstance } from 'fastify';
import { register } from './controllers/register-student';
import { listStudents } from './controllers/list-students';
import { listStudentUserByRA } from './controllers/list-student-by-ra';
import { updateUser } from './controllers/update';
import { deleteUserByRA } from './controllers/delete-user-by-ra';
import { authenticateUser } from './controllers/authenticate-user';
import { registerAuthUser } from './controllers/register-auth-user';
import { authorize } from './middlewares/authorize';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', authenticateUser);
  app.post(
    '/auth/users',
    { preHandler: authorize('users:create') },
    registerAuthUser,
  );
}

export async function usersRoutes(app: FastifyInstance) {
  app.post('/students', { preHandler: authorize('students:create') }, register);
  app.get('/students', { preHandler: authorize('students:read') }, listStudents);
  app.get(
    '/students/:ra',
    { preHandler: authorize('students:read') },
    listStudentUserByRA,
  );
  app.put(
    '/students/:ra',
    { preHandler: authorize('students:create') },
    updateUser,
  );
  app.delete(
    '/students/:ra',
    { preHandler: authorize('students:create') },
    deleteUserByRA,
  );
}
