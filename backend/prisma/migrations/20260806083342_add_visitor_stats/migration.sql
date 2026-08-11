/*
  Warnings:

  - A unique constraint covering the columns `[tmdb_id]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "tmdb_id" INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DEFAULT '/avatars/default_avatar.png';

-- CreateTable
CREATE TABLE "visitor_stats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "visitor_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_tmdb_id_key" ON "movies"("tmdb_id");
