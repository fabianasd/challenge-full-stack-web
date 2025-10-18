import pino, { type Logger, type TransportTargetOptions } from 'pino';

const isDev = process.env.NODE_ENV === 'dev' || process.env.LOG_STDOUT === '1';

const logLevel = process.env.LOG_LEVEL ?? 'info';

const lokiTarget: TransportTargetOptions = {
  target: 'pino-loki',
  level: logLevel,
  options: {
    host: process.env.LOKI_URL ?? 'http://192.168.100.250:3100',
    labels: { app: 'students-app', env: process.env.NODE_ENV ?? 'dev' },
    batching: false,
    interval: 1000,
    replaceTimestamp: false,
    timeout: 5000,
  },
};

// stdout target has a different options shape; keep it as TransportTargetOptions
const stdoutTarget: TransportTargetOptions = {
  target: 'pino/file',
  level: logLevel,
  options: { destination: 1 }, // stdout
};

// 👇 Explicitly type the array so TS doesn't try to infer incompatible generics
const targets: TransportTargetOptions[] = isDev
  ? [lokiTarget, stdoutTarget]
  : [lokiTarget];

const transport = pino.transport({
  targets,
}) as unknown as NodeJS.WritableStream;

// Surface transport issues in container logs
transport.on?.('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('[pino-transport error]', e);
});
transport.on?.('close', () => {
  // eslint-disable-next-line no-console
  console.error('[pino-transport closed]');
});

export const baseLogger: Logger = pino(
  { level: logLevel, base: undefined },
  transport,
);

export function createRequestLogger(ctx: Record<string, unknown>): Logger {
  return baseLogger.child({ ...ctx });
}
