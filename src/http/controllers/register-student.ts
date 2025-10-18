import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { makeRegisterStudentsUseCase } from '../../use-cases/factories/make-register-students-use-case';
import { StudentError } from '../../shared/errors/students.error';
import { ERROR_MESSAGES } from '../../shared/errors/error-messages';

const onlyDigits = (s: string) => s.replace(/\D/g, '');

const cpfSchema = z
  .string()
  .transform(onlyDigits)
  .refine((v) => cpfValidator.isValid(v), 'CPF inválido');

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().max(255),
    email: z.string().max(255).email(),
    cpf: cpfSchema,
    ra: z.string().trim().min(1, 'RA é obrigatório'),
  });

  const { name, email, cpf, ra } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterStudentsUseCase(request);

    const student = await registerUseCase.execute({
      name,
      email,
      cpf,
      ra,
    });

    return reply.status(201).send(student);
  } catch (err) {
    if (err instanceof StudentError) {
      return reply
        .status(err.statusCode || 500)
        .send({ error: { type: err.errorType, message: err.message } });
    }

    return reply
      .status(500)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
