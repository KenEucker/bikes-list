DO $$ BEGIN
    CREATE TYPE "MediaOwnerType" AS ENUM ('FOR_SALE', 'EVENT', 'SHOP', 'ORG', 'AD', 'USER_AVATAR');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "MediaVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "ModerationActionType" AS ENUM ('APPROVE', 'REJECT');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "media_objects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_type" "MediaOwnerType" NOT NULL,
    "owner_id" TEXT NOT NULL,
    "city_id" UUID,
    "uploader_user_id" UUID,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "byte_size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sha256" TEXT,
    "verification_status" "MediaVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "media_objects_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "media_objects_owner_type_owner_id_idx" ON "media_objects"("owner_type", "owner_id");
CREATE INDEX "media_objects_verification_status_idx" ON "media_objects"("verification_status");

CREATE TABLE "moderation_actions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID NOT NULL,
    "action_type" "ModerationActionType" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "city_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "moderation_actions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "moderation_actions_entity_type_entity_id_idx"
    ON "moderation_actions"("entity_type", "entity_id");

ALTER TABLE "media_objects"
    ADD CONSTRAINT "media_objects_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "media_objects"
    ADD CONSTRAINT "media_objects_uploader_user_id_fkey"
    FOREIGN KEY ("uploader_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "moderation_actions"
    ADD CONSTRAINT "moderation_actions_actor_user_id_fkey"
    FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "moderation_actions"
    ADD CONSTRAINT "moderation_actions_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
