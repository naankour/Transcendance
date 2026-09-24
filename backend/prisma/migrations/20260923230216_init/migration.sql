/*
  Warnings:

  - A unique constraint covering the columns `[tmdb_id]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN IF NOT EXISTS "tmdb_id" INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DEFAULT '/avatars/default_avatar.png';

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "movies_tmdb_id_key" ON "movies"("tmdb_id");