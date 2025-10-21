import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AuthUserEntity } from '../../entities/auth-user';
import type {
  AuthUsersRepository,
  CreateAuthUserRepositoryInput,
} from '../auth-users-repository';

type PrismaClientOrTx = Prisma.TransactionClient | PrismaClient;

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export class PrismaAuthUsersRepository implements AuthUsersRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const user = await this.findUserWithRelations(this.client, { email });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async create(
    input: CreateAuthUserRepositoryInput,
  ): Promise<AuthUserEntity> {
    return this.client.$transaction(async (tx) => {
      const personId = await this.createPerson(tx, input);
      const userId = await this.createAuthUser(tx, {
        personId,
        email: input.email,
        passwordHash: input.passwordHash,
      });

      await this.attachRoles(tx, {
        userId,
        roleNames: input.roleNames,
      });

      const user = await this.findUserWithRelations(tx, { userId });

      if (!user) {
        throw new Error('User not found after creation');
      }

      return this.toEntity(user);
    });
  }

  private async createPerson(
    tx: Prisma.TransactionClient,
    input: CreateAuthUserRepositoryInput,
  ): Promise<number> {
    const person = await tx.person.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        document: input.document,
      },
      select: { personId: true },
    });

    return Number(person.personId);
  }

  private async createAuthUser(
    tx: Prisma.TransactionClient,
    input: { personId: number; email: string; passwordHash: string },
  ): Promise<number> {
    const [row] = await tx.$queryRaw<{ user_id: bigint }[]>`
      INSERT INTO auth_user (person_id, email, password_hash, created_at, updated_at)
      VALUES (${input.personId}, ${input.email}, ${input.passwordHash}, NOW(), NOW())
      RETURNING user_id;
    `;

    return Number(row.user_id);
  }

  private async attachRoles(
    tx: Prisma.TransactionClient,
    input: { userId: number; roleNames: string[] },
  ) {
    if (input.roleNames.length === 0) {
      throw new Error('User must be created with at least one role');
    }

    const roles = await tx.$queryRaw<{ role_id: bigint; name: string }[]>`
      SELECT role_id, name
      FROM auth_role
      WHERE name = ANY(${input.roleNames});
    `;

    if (roles.length !== input.roleNames.length) {
      const found = new Set(roles.map((role) => role.name));
      const missing = input.roleNames.filter((name) => !found.has(name));
      throw new Error(`Roles not found: ${missing.join(', ')}`);
    }

    for (const role of roles) {
      await tx.$executeRaw`
        INSERT INTO auth_user_role (user_id, role_id)
        VALUES (${input.userId}, ${Number(role.role_id)})
        ON CONFLICT (user_id, role_id) DO NOTHING;
      `;
    }
  }

  private async findUserWithRelations(
    client: PrismaClientOrTx,
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithRelations | null> {
    return client.user.findUnique({
      where,
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private toEntity(user: UserWithRelations): AuthUserEntity {
    const permissionNames = new Set<string>();
    const roleNames = new Set<string>();

    for (const userRole of user.userRoles) {
      const role = userRole.role;
      if (!role) {
        continue;
      }

      roleNames.add(role.name);

      for (const rolePermission of role.rolePermissions) {
        const permission = rolePermission.permission;
        if (permission) {
          permissionNames.add(permission.name);
        }
      }
    }

    return AuthUserEntity.toEntity({
      id: user.userId,
      personId: user.personId,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      permissions: Array.from(permissionNames).map((name) => ({ name })),
      roles: Array.from(roleNames).map((name) => ({ name })),
    });
  }
}
