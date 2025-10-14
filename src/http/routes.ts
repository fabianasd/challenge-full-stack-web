import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', (request: FastifyRequest, reply: FastifyReply) => {

    })
}
