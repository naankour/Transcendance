const express = require('express');
const { initializeDatabase } = require('./config/db');
const { test_seed } = require('./prisma/seed')
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = 3000;

const authRoutes = require('./api/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./api/users');
app.use('/api/users', userRoutes);

const actorRoutes = require('./api/actors');
app.use('/api', actorRoutes);

const reviewRoutes = require('./api/reviews');
app.use('/api/reviews', reviewRoutes);

const watchlistRoutes = require('./api/watchlist');
app.use('/api/watchlist', watchlistRoutes);

const favoriteRoutes = require('./api/favorites');
app.use('/api/favorites', favoriteRoutes);

const followRoutes = require('./api/follows');
app.use('/api/follows', followRoutes);

const movieRoutes = require('./api/movies');
app.use('/api/movies', movieRoutes);

const conversationRoute = require('./api/conversations');
app.use('/api/conversations', conversationRoute);

// const genreRoutes = require('./api/genres');
// app.use('/api/genres', genreRoutes);

async function startServer() {
  console.log("1");

  try {
    console.log("2");
    await initializeDatabase();
    await test_seed()
    console.log("3");

    app.listen(PORT, '0.0.0.0', () => {
      console.log("4");
      console.log(`Server running on port ${PORT}`);
    });

    console.log("5");
  } catch (error) {
    console.error(error);
  }
}


startServer();