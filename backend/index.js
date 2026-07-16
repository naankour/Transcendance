const express = require('express');
const { initializeDatabase } = require('./config/db');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = 3000;

async function startServer() {
  console.log("1");

  try {
    console.log("2");
    await initializeDatabase();
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



// Route pour récupérer un film depuis TMDB
app.get('/movies/search/:name', async (req, res) => {
  try {
    const name = req.params.name;

    // 1. Recherche du film par nom
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${name}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const searchData = await searchResponse.json();

    if (searchData.results.length === 0) {
      return res.status(404).json({
        error: "Film introuvable"
      });
    }

    // Premier résultat trouvé
    const movieId = searchData.results[0].id;


    // 2. Récupération des détails
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movie = await movieResponse.json();

    res.json(movie);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur serveur"
    });
  }
});