import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

const SALT_SIZE = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string, salt?: string) {
  const finalSalt = salt ?? randomBytes(SALT_SIZE).toString('hex');
  const derivedKey = (await scrypt(password, finalSalt, KEY_LENGTH)) as Buffer;

  return `${finalSalt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedKeyHex] = passwordHash.split(':');

  if (!salt || !storedKeyHex) {
    throw new Error('Invalid password hash format');
  }

  const storedKey = Buffer.from(storedKeyHex, 'hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}
