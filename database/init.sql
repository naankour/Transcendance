
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
        CHECK (average_rating >= 0 AND average_rating <= 10),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating DECIMAL(2,1),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) 
    -- FOREIGN KEY (movie_id) REFERENCES movies(id),
    ON DELETE CASCADE
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id),
    -- FOREIGN KEY (movie_id) REFERENCES movies(id)
);

CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id),
    -- FOREIGN KEY (movie_id) REFERENCES movies(id)
);


-- ajout du bon vieux victor mcbernick pour voir si l'automatisation marche bien
INSERT INTO users (firstname, lastname, username, email, password_hash, bio) 
VALUES ('Victor', 'McBernick', 'Le V', 'vivipirate06@gmail.com', 'allezvivi.com', 'je suis le roi des pirates')
ON CONFLICT DO NOTHING;