const express = require('express');
const path = require('path');
const { initializeDatabase } = require('./config/db');
const { test_seed } = require('./prisma/seed')
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://localhost",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected :", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected :", socket.id);
  });
});

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

const discoverRoutes = require('./api/discover');
app.use('/api/discover', discoverRoutes);

const searchRoutes = require('./api/search');
app.use('/api', searchRoutes);

const recommendationRoutes = require('./api/recommendation');
app.use('/api', recommendationRoutes);

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

const visitorRoutes = require('./api/visitors');
app.use('/api', visitorRoutes);

const activityRoutes = require('./api/activity');
app.use('/api', activityRoutes);

// const genreRoutes = require('./api/genres');
// app.use('/api/genres', genreRoutes);

async function startServer() {
  console.log("1");

  try {
    console.log("2");
    await initializeDatabase();
    await test_seed()
    console.log("3");

    server.listen(PORT, '0.0.0.0', () => {
      console.log("4");
      console.log(`Server running on port ${PORT}`);
    });

    console.log("5");
  } catch (error) {
    console.error(error);
  }
}


startServer();