import fastify from 'fastify'
import { usersRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env/index'

export const app = fastify()

app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.issues })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})
