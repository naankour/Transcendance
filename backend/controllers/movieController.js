const prisma = require('../prisma/prismaClient.js');

// Fonction utilitaire : va chercher un film sur TMDB et l'upsert en base
async function upsertMovieFromTmdb(tmdbId) {
  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }
  );

  if (!movieResponse.ok) {
    return null; // film introuvable sur TMDB
  }

  const movie = await movieResponse.json();

  const director = movie.credits.crew.find(person => person.job === "Director");
  const cast = movie.credits.cast.slice(0, 10).map(actor => ({
    name: actor.name,
    character: actor.character,
  }));

  const metadata = {
    genres: movie.genres.map(g => g.name),
    runtime: movie.runtime,
    vote_average: movie.vote_average,
    director: director ? director.name : null,
    cast: cast,
  };

  const savedMovie = await prisma.movies.upsert({
    where: { tmdb_id: tmdbId },
    update: {
      title: movie.title,
      synopsis: movie.overview,
      poster: movie.poster_path,
      release_date: movie.release_date ? new Date(movie.release_date) : null,
      metadata: metadata,
      imdb_id: movie.imdb_id || null,
    },
    create: {
      tmdb_id: tmdbId,
      title: movie.title,
      synopsis: movie.overview,
      poster: movie.poster_path,
      release_date: movie.release_date ? new Date(movie.release_date) : null,
      metadata: metadata,
      imdb_id: movie.imdb_id || null,
    },
  });

  return { savedMovie, metadata };
}

async function searchMovie(req, res) {
  try {
    const name = req.params.name;

    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    if (!searchResponse.ok) {
      return res.status(502).json({ error: "Erreur API TMDB" });
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return res.status(404).json({ error: "Film introuvable" });
    }

    const movieId = searchData.results[0].id;
    req.params.id = movieId;
    return getMovieById(req, res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function getMovieById(req, res) {
  try {
    const tmdbId = parseInt(req.params.id);

    const result = await upsertMovieFromTmdb(tmdbId);
    if (!result) {
      return res.status(404).json({ error: "Film introuvable" });
    }
    const { savedMovie, metadata } = result;

    // On va chercher les reviews existantes, avec le nom d'utilisateur associé
    const reviews = await prisma.reviews.findMany({
      where: { movie_id: savedMovie.id },
      include: {
        users: {
          select: { id: true, username: true, avatar_url: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      id: savedMovie.id,           // id LOCAL (utile pour poster une review)
      tmdb_id: savedMovie.tmdb_id, // id TMDB (utile pour l'URL)
      title: savedMovie.title,
      overview: savedMovie.synopsis,
      release_date: savedMovie.release_date,
      poster_path: savedMovie.poster,
      runtime: metadata.runtime,
      genres: metadata.genres,
      vote_average: metadata.vote_average,
      director: metadata.director,
      cast: metadata.cast,
      average_rating: savedMovie.average_rating,
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        content: r.content,
        created_at: r.created_at,
        user: r.users,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Poster ou mettre à jour sa propre review sur un film (nécessite d'être connecté)
async function postReview(req, res) {
  try {
    const tmdbId = parseInt(req.params.id);
    const userId = req.user.id; // vient du middleware authenticateToken
    const { rating, content } = req.body;

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "La note doit être entre 0 et 5" });
    }

    // On s'assure que le film existe en base (au cas où l'utilisateur poste sans avoir visité la page)
    const result = await upsertMovieFromTmdb(tmdbId);
    if (!result) {
      return res.status(404).json({ error: "Film introuvable" });
    }
    const { savedMovie } = result;

    // Upsert : crée la review si elle n'existe pas, ou la met à jour si l'utilisateur en avait déjà posté une
    const review = await prisma.reviews.upsert({
      where: {
        user_id_movie_id: {
          user_id: userId,
          movie_id: savedMovie.id,
        },
      },
      update: {
        rating: rating,
        content: content || null,
      },
      create: {
        user_id: userId,
        movie_id: savedMovie.id,
        rating: rating,
        content: content || null,
      },
    });

    // On recalcule la note moyenne du film
    const agg = await prisma.reviews.aggregate({
      where: { movie_id: savedMovie.id },
      _avg: { rating: true },
    });

    await prisma.movies.update({
      where: { id: savedMovie.id },
      data: { average_rating: agg._avg.rating || 0 },
    });

    res.json({ message: "Review enregistrée", review });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { searchMovie, getMovieById, postReview };