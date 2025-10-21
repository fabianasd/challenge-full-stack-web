-- DropForeignKey
ALTER TABLE "public"."auth_role_permission" DROP CONSTRAINT "auth_role_permission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."auth_role_permission" DROP CONSTRAINT "auth_role_permission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."auth_user_role" DROP CONSTRAINT "auth_user_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."auth_user_role" DROP CONSTRAINT "auth_user_role_user_id_fkey";

-- AlterTable
ALTER TABLE "auth_permission" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "auth_role" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "auth_user" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "auth_user_role" ADD CONSTRAINT "auth_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_role" ADD CONSTRAINT "auth_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth_role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_role_permission" ADD CONSTRAINT "auth_role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth_role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_role_permission" ADD CONSTRAINT "auth_role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "auth_role_permission_role_unique" RENAME TO "auth_role_permission_role_id_permission_id_key";

-- RenameIndex
ALTER INDEX "auth_user_person_id_unique" RENAME TO "auth_user_person_id_key";

-- RenameIndex
ALTER INDEX "auth_user_role_user_unique" RENAME TO "auth_user_role_user_id_role_id_key";
