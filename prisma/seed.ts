import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/shared/security/password';

const prisma = new PrismaClient();

async function upsertAdminUser() {
  const adminName = process.env.ADMIN_NAME ?? 'admin';
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@email.com';
  const adminDocument = process.env.ADMIN_DOCUMENT ?? '91399943090';
  const adminPassword = process.env.ADMIN_PASSWORD ?? '12345678';

  const person = await prisma.person.upsert({
    where: { email: adminEmail },
    update: {
      fullName: adminName,
      document: adminDocument,
    },
    create: {
      fullName: adminName,
      email: adminEmail,
      document: adminDocument,
    },
  });

  const passwordHash = await hashPassword(adminPassword);

  const [user] = await prisma.$queryRaw<
    { user_id: bigint }[]
  >`INSERT INTO "auth_user" ("person_id", "email", "password_hash", "created_at", "updated_at")
    VALUES (${person.personId}, ${adminEmail}, ${passwordHash}, NOW(), NOW())
    ON CONFLICT ("email") DO UPDATE
      SET "person_id" = EXCLUDED."person_id",
          "password_hash" = EXCLUDED."password_hash",
          "is_active" = TRUE,
          "updated_at" = NOW()
    RETURNING "user_id";`;

  return { userId: Number(user.user_id) };
}

async function ensureRole(name: string, description: string | null = null) {
  const [role] = await prisma.$queryRaw<
    { role_id: bigint }[]
  >`INSERT INTO "auth_role" ("name", "description", "created_at", "updated_at")
    VALUES (${name}, ${description}, NOW(), NOW())
    ON CONFLICT ("name") DO UPDATE
      SET "description" = COALESCE(EXCLUDED."description", "auth_role"."description"),
          "updated_at" = NOW()
    RETURNING "role_id";`;

  return { roleId: Number(role.role_id) };
}

async function ensurePermission(
  name: string,
  description: string | null = null,
) {
  const [permission] = await prisma.$queryRaw<
    { permission_id: bigint }[]
  >`INSERT INTO "auth_permission" ("name", "description", "created_at", "updated_at")
    VALUES (${name}, ${description}, NOW(), NOW())
    ON CONFLICT ("name") DO UPDATE
      SET "description" = COALESCE(EXCLUDED."description", "auth_permission"."description"),
          "updated_at" = NOW()
    RETURNING "permission_id";`;

  return { permissionId: Number(permission.permission_id) };
}

async function ensureRolePermission(roleId: number, permissionId: number) {
  await prisma.$executeRaw`
    INSERT INTO "auth_role_permission" ("role_id", "permission_id")
    VALUES (${roleId}, ${permissionId})
    ON CONFLICT ("role_id", "permission_id") DO NOTHING;
  `;
}

async function ensureUserRole(userId: number, roleId: number) {
  await prisma.$executeRaw`
    INSERT INTO "auth_user_role" ("user_id", "role_id")
    VALUES (${userId}, ${roleId})
    ON CONFLICT ("user_id", "role_id") DO NOTHING;
  `;
}

async function main() {
  const adminUser = await upsertAdminUser();

  const adminRole = await ensureRole('admin', 'Full access to student management');

  const studentsCreatePermission = await ensurePermission(
    'students:create',
    'Criação e atualização de alunos',
  );
  const studentsReadPermission = await ensurePermission(
    'students:read',
    'Leitura de dados de alunos',
  );
  const usersCreatePermission = await ensurePermission(
    'users:create',
    'Criação de usuários autenticados',
  );

  await ensureRolePermission(adminRole.roleId, studentsCreatePermission.permissionId);
  await ensureRolePermission(adminRole.roleId, studentsReadPermission.permissionId);
  await ensureRolePermission(adminRole.roleId, usersCreatePermission.permissionId);

  const creatorRole = await ensureRole(
    'students-creator',
    'Criação e atualização de alunos',
  );
  await ensureRolePermission(
    creatorRole.roleId,
    studentsCreatePermission.permissionId,
  );

  const readerRole = await ensureRole(
    'students-reader',
    'Acesso somente leitura aos alunos',
  );
  await ensureRolePermission(
    readerRole.roleId,
    studentsReadPermission.permissionId,
  );

  const userCreateRole = await ensureRole(
    'user:create',
    'Permite gerenciar usuários autenticados',
  );
  await ensureRolePermission(
    userCreateRole.roleId,
    usersCreatePermission.permissionId,
  );

  await ensureUserRole(adminUser.userId, adminRole.roleId);
  await ensureUserRole(adminUser.userId, userCreateRole.roleId);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
