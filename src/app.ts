import fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { baseLogger, createRequestLogger } from './logger';
import cors from '@fastify/cors';
import { authRoutes, usersRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env/index';

export const app = fastify({
  loggerInstance: baseLogger,
  genReqId: (req) => req.headers['x-request-id']?.toString() || randomUUID(),
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'requestId',
});

app.register(cors, {
  origin: true,
  credentials: true,
});

app.addHook('onRequest', (req, _reply, done) => {
  req.customLogger = createRequestLogger({
    requestId: req.id,
    path: req.url,
    method: req.method,
  });

  req.customLogger.info({ path: req.url, method: req.method }, 'request');

  done();
});

app.register(authRoutes);
app.register(usersRoutes);

app.setErrorHandler((error, request, reply) => {
  const logger = request?.log ?? baseLogger;
  logger.error({ err: error }, 'response');
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.issues });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});

baseLogger.info('System bootstrapped');
