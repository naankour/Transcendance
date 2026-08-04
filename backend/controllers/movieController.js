const prisma = require('../prisma/prismaClient.js');
const { getTmdbLanguage } = require('../utils/tmdbLang');

// Fonction utilitaire : va chercher un film sur TMDB et l'upsert en base
async function upsertMovieFromTmdb(tmdbId, tmdbLanguage) {
  const movieResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits&language=${tmdbLanguage}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }
  );

  if (!movieResponse.ok) {
    return null;
  }

  const movie = await movieResponse.json();

  const director = movie.credits.crew.find(person => person.job === "Director");
  const directorData = director ? { id: director.id, name: director.name } : null;

  const cast = movie.credits.cast.slice(0, 10).map(actor => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profile_path: actor.profile_path,
  }));

  const metadata = {
    genres: movie.genres.map(g => g.name),
    runtime: movie.runtime,
    vote_average: movie.vote_average,
    director: directorData,
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
    const tmdbLanguage = getTmdbLanguage(req.query.lang);

    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}&language=${tmdbLanguage}`,
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
    const tmdbLanguage = getTmdbLanguage(req.query.lang);

    const result = await upsertMovieFromTmdb(tmdbId, tmdbLanguage);
    if (!result) {
      return res.status(404).json({ error: "Film introuvable" });
    }
    const { savedMovie, metadata } = result;

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
      id: savedMovie.id,
      tmdb_id: savedMovie.tmdb_id,
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

async function postReview(req, res) {
  try {
    const tmdbId = parseInt(req.params.id);
    const tmdbLanguage = getTmdbLanguage(req.query.lang);
    const userId = req.user.id;
    const { rating, content } = req.body;

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "La note doit être entre 0 et 5" });
    }

    const result = await upsertMovieFromTmdb(tmdbId, tmdbLanguage);
    if (!result) {
      return res.status(404).json({ error: "Film introuvable" });
    }
    const { savedMovie } = result;

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