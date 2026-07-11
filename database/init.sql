
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

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,

    user_id INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    CHECK (rating IN (0.5,1,1.5,2,2.5,3,3.5,4,4.5,5)),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    -- FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,

    UNIQUE(user_id, movie_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,

    PRIMARY KEY(follower_id, followed_id),
    CHECK (follower_id <> followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ajout du bon vieux victor mcbernick pour voir si l'automatisation marche bien
INSERT INTO users (firstname, lastname, username, email, password_hash, bio) 
VALUES ('Victor', 'McBernick', 'Le V', 'vivipirate06@gmail.com', 'allezvivi.com', 'je suis le roi des pirates')
ON CONFLICT DO NOTHING;