import { createHmac, timingSafeEqual } from 'node:crypto';

type ExpiresIn = `${number}${'s' | 'm' | 'h' | 'd'}` | number;

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function resolveExpiration(expiresIn?: ExpiresIn) {
  if (expiresIn === undefined) {
    return undefined;
  }

  if (typeof expiresIn === 'number') {
    return expiresIn;
  }

  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  const unitToSeconds: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * unitToSeconds[unit];
}

interface SignOptions {
  expiresIn?: ExpiresIn;
  subject?: string | number;
}

export function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  options: SignOptions = {},
) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Math.floor(Date.now() / 1000);
  const expOffset = resolveExpiration(options.expiresIn);

  const fullPayload = {
    ...payload,
    ...(options.subject ? { sub: options.subject } : {}),
    iat: issuedAt,
    ...(expOffset ? { exp: issuedAt + expOffset } : {}),
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${headerEncoded}.${payloadEncoded}`;

  const signature = createHmac('sha256', secret).update(data).digest('base64url');

  return `${data}.${signature}`;
}

export interface VerifiedJwt<TPayload = Record<string, unknown>> {
  header: Record<string, unknown>;
  payload: TPayload & { iat: number; exp?: number; sub?: string };
}

export function verifyJwt<TPayload = Record<string, unknown>>(
  token: string,
  secret: string,
): VerifiedJwt<TPayload> {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerEncoded, payloadEncoded, signature] = parts;
  const data = `${headerEncoded}.${payloadEncoded}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  const signatureBuffer = Buffer.from(signature, 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid token signature');
  }

  const header = JSON.parse(base64UrlDecode(headerEncoded)) as Record<
    string,
    unknown
  >;
  const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as TPayload & {
    iat: number;
    exp?: number;
    sub?: string;
  };

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return { header, payload };
}
