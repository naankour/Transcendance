const express = require('express')
const { initializeDatabase } = require('./config/db');
require('dotenv').config();

const app = express()

initializeDatabase();

// Route pour récupérer un film depuis TMDB par son ID
app.get('/movies/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    if (!movieResponse.ok) {
      return res.status(404).json({
        error: "Film introuvable"
      });
    }

    const movie = await movieResponse.json();

    const director = movie.credits.crew.find(person => person.job === "Director");
    const cast = movie.credits.cast.slice(0, 10).map(actor => ({
      name: actor.name,
      character: actor.character,
    }));

    res.json({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres.map(g => g.name),
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
      director: director ? director.name : null,
      cast,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur serveur"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});