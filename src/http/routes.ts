import type { FastifyInstance } from 'fastify';
import { register } from './controllers/register-student';
import { listStudents } from './controllers/list-students';
import { listStudentUserByRA } from './controllers/list-student-by-ra';
import { updateUser } from './controllers/update';
import { deleteUserByRA } from './controllers/delete-user-by-ra';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/students', register);
  app.get('/students', listStudents);
  app.get('/students/:ra', listStudentUserByRA);
  app.put('/students/:ra', updateUser);
  app.delete('/students/:ra', deleteUserByRA);
}
