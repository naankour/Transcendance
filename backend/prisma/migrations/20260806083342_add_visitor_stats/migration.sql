-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DEFAULT '/avatars/default_avatar.png';

-- CreateTable
CREATE TABLE "visitor_stats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "visitor_stats_pkey" PRIMARY KEY ("id")
);