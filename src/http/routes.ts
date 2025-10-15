import type { FastifyInstance } from 'fastify';
import { register } from "./controllers/register.js"

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
