const prisma = require('../prisma/prismaClient');

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

    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    if (!movieResponse.ok) {
      return res.status(404).json({ error: "Film introuvable" });
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
      include: {
        reviews: true,
      },
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
      reviews: savedMovie.reviews,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { searchMovie, getMovieById };