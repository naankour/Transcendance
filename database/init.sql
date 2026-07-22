
-- ici on crée les tables du projet

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT DEFAULT 'default_avatar.png',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    id             SERIAL PRIMARY KEY,
    imdb_id        VARCHAR(20) UNIQUE,
    title          VARCHAR(255) NOT NULL,
    synopsis       TEXT,
    poster         TEXT,
    release_date   DATE,
    metadata       JSONB,
    average_rating DECIMAL(3,2) DEFAULT 0
        CHECK (average_rating >= 0 AND average_rating <= 5),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(2,1)
        CHECK (rating >= 0 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,

    follower_id INT NOT NULL,
    followed_id INT NOT NULL,

    UNIQUE(follower_id, followed_id),

    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actors (
    id SERIAL PRIMARY KEY,
    tmdb_id BIGINT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    birthday DATE,
    deathday DATE,
    place_of_birth VARCHAR(255),

    gender SMALLINT,
    known_for_department VARCHAR(100),
    profile_path TEXT,
    imdb_id VARCHAR(50),
    also_known_as TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movie_actor (
    id SERIAL PRIMARY KEY,

    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    character_name TEXT,
    credit_id VARCHAR(100) UNIQUE NOT NULL,
    cast_order INTEGER,

    FOREIGN KEY (actor_id)
        REFERENCES actors(id)
        ON DELETE CASCADE,

    FOREIGN KEY (movie_id)
        REFERENCES movies(id)
        ON DELETE CASCADE,

    UNIQUE (movie_id, actor_id, character_name)
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genre (
    id SERIAL PRIMARY KEY,

    movie_id INT NOT NULL,
    genre_id INT NOT NULL,

    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE, 
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,

    UNIQUE (movie_id, genre_id)
);

-- ajout du bon vieux victor mcbernick pour voir si l'automatisation marche bien
INSERT INTO users (firstname, lastname, username, email, password_hash, bio) 
VALUES ('Victor', 'McBernick', 'Le V', 'vivipirate06@gmail.com', 'allezvivi.com', 'je suis le roi des pirates')
ON CONFLICT DO NOTHING;