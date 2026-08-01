-- CreateTable
CREATE TABLE "actors" (
    "id" SERIAL NOT NULL,
    "tmdb_id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "biography" TEXT,
    "birthday" DATE,
    "deathday" DATE,
    "place_of_birth" VARCHAR(255),
    "gender" SMALLINT,
    "known_for_department" VARCHAR(100),
    "profile_path" TEXT,
    "imdb_id" VARCHAR(50),
    "also_known_as" TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_actor" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "actor_id" INTEGER NOT NULL,
    "character_name" TEXT,
    "credit_id" VARCHAR(100) NOT NULL,
    "cast_order" INTEGER,

    CONSTRAINT "movie_actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_genre" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "movie_genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "imdb_id" VARCHAR(20),
    "title" VARCHAR(255) NOT NULL,
    "synopsis" TEXT,
    "poster" TEXT,
    "release_date" DATE,
    "metadata" JSONB,
    "average_rating" DECIMAL(3,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" DECIMAL(2,1),
    "content" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(30),
    "lastname" VARCHAR(30),
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "avatar_url" TEXT DEFAULT 'default_avatar.png',
    "bio" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "followed_id" INTEGER NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actors_tmdb_id_key" ON "actors"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_movie_id_key" ON "favorites"("user_id", "movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "movie_actor_credit_id_key" ON "movie_actor"("credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_actor_movie_id_actor_id_character_name_key" ON "movie_actor"("movie_id", "actor_id", "character_name");

-- CreateIndex
CREATE UNIQUE INDEX "movie_genre_movie_id_genre_id_key" ON "movie_genre"("movie_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "movies_imdb_id_key" ON "movies"("imdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_movie_id_key" ON "reviews"("user_id", "movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_user_id_movie_id_key" ON "watchlist"("user_id", "movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_followed_id_key" ON "follows"("follower_id", "followed_id");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movie_genre" ADD CONSTRAINT "movie_genre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movie_genre" ADD CONSTRAINT "movie_genre_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
