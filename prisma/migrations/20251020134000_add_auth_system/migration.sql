-- Create table for application users
CREATE TABLE IF NOT EXISTS "auth_user" (
  "user_id" BIGSERIAL PRIMARY KEY,
  "person_id" BIGINT NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE "auth_user"
  ADD CONSTRAINT "auth_user_person_id_unique" UNIQUE ("person_id");

ALTER TABLE "auth_user"
  ADD CONSTRAINT "auth_user_person_id_fkey"
    FOREIGN KEY ("person_id") REFERENCES "person"("person_id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create table for roles
CREATE TABLE IF NOT EXISTS "auth_role" (
  "role_id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create table for permissions
CREATE TABLE IF NOT EXISTS "auth_permission" (
  "permission_id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Link roles to permissions
CREATE TABLE IF NOT EXISTS "auth_role_permission" (
  "role_permission_id" BIGSERIAL PRIMARY KEY,
  "role_id" BIGINT NOT NULL,
  "permission_id" BIGINT NOT NULL
);

ALTER TABLE "auth_role_permission"
  ADD CONSTRAINT "auth_role_permission_role_unique"
    UNIQUE ("role_id", "permission_id");

ALTER TABLE "auth_role_permission"
  ADD CONSTRAINT "auth_role_permission_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "auth_role"("role_id")
    ON DELETE CASCADE;

ALTER TABLE "auth_role_permission"
  ADD CONSTRAINT "auth_role_permission_permission_id_fkey"
    FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("permission_id")
    ON DELETE CASCADE;

-- Link users to roles
CREATE TABLE IF NOT EXISTS "auth_user_role" (
  "user_role_id" BIGSERIAL PRIMARY KEY,
  "user_id" BIGINT NOT NULL,
  "role_id" BIGINT NOT NULL
);

ALTER TABLE "auth_user_role"
  ADD CONSTRAINT "auth_user_role_user_unique"
    UNIQUE ("user_id", "role_id");

ALTER TABLE "auth_user_role"
  ADD CONSTRAINT "auth_user_role_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "auth_user"("user_id")
    ON DELETE CASCADE;

ALTER TABLE "auth_user_role"
  ADD CONSTRAINT "auth_user_role_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "auth_role"("role_id")
    ON DELETE CASCADE;

-- Maintain updated_at columns via trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_auth_user_updated_at
  BEFORE UPDATE ON "auth_user"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_auth_role_updated_at
  BEFORE UPDATE ON "auth_role"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_auth_permission_updated_at
  BEFORE UPDATE ON "auth_permission"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
