import type { FastifyInstance } from 'fastify';
import { register } from "./controllers/register";
import { listUsers } from './controllers/get-all';
import { getUserByRA } from './controllers/get-by-ra';
import { updateUser } from './controllers/update';
import { deleteUserByRA } from './controllers/delete-user-by-ra';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/users', listUsers)
  app.get('/users/:ra', getUserByRA)
  app.put('/users/:ra', updateUser)
  app.delete('/users/:ra', deleteUserByRA)
}
