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

    const searchData = await searchResponse.json();

    if (searchData.results.length === 0) {
      return res.status(404).json({ error: "Film introuvable" });
    }

    const movieId = searchData.results[0].id;

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
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function getMovieById(req, res) {
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
      return res.status(404).json({ error: "Film introuvable" });
    }

    const movie = await movieResponse.json();

    const director = movie.credits.crew.find(person => person.job === "Director");
	let directorData = null;
	if (director)
		directorData = { id: director.id, name: director.name };

    const cast = movie.credits.cast.slice(0, 10).map(actor => ({
	  id: actor.id,
      name: actor.name,
      character: actor.character,
	  profile_path: actor.profile_path,
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
      director: directorData,
      cast,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { searchMovie, getMovieById };