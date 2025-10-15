import type { FastifyInstance } from 'fastify';
import { register } from "./controllers/register";
import { listUsers } from './controllers/get-all';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/users', listUsers) 
}
