DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'MAINTAINER', 'AMBASSADOR', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "Module" AS ENUM ('EVENTS', 'SHOPS', 'ORGS', 'FORSALE', 'IMAGES', 'ADS', 'DISCORD');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "AuthProvider" AS ENUM ('DISCORD', 'GOOGLE', 'MAGIC_LINK');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "discord_id" TEXT,
    "google_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "last_login_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "last_used_at" TIMESTAMPTZ,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

CREATE TABLE "role_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL,
    "city_id" UUID,
    "module" "Module",
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "role_assignments_user_id_role_city_id_module_key"
    ON "role_assignments"("user_id", "role", "city_id", "module");

ALTER TABLE "sessions"
    ADD CONSTRAINT "sessions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_assignments"
    ADD CONSTRAINT "role_assignments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_assignments"
    ADD CONSTRAINT "role_assignments_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
