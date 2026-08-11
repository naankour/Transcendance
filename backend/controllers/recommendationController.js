const { getTmdbLanguage } = require('../utils/tmdbLang');

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

let cachedMovieId = null;
let cachedBucket = null;

const getCurrentRecommendation = async (req, res) => {
	const tmdbLanguage = getTmdbLanguage(req.query.lang);
	const bucket = Math.floor(Date.now() / TWELVE_HOURS_MS);

	try {
		if (cachedMovieId === null || cachedBucket !== bucket) {
			const page = (bucket % 20) + 1;
		
			//get a well rated movie from TMDB
			const topRatedResponse = await fetch(
				`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
						Accept: "application/json",
					},
				}
			);
		
			if (!topRatedResponse.ok) {
				return res.status(502).json({ error: "Error communicating with TMDB" });
			}
		
			const topRatedData = await topRatedResponse.json();
			const movies = (topRatedData.results || []).filter((movie) => movie.poster_path !== null);
		
			if (movies.length === 0)
				return res.status(404).json({ error: "No movie found" });
		
			const index = bucket % movies.length;
			cachedMovieId = movies[index].id;
			cachedBucket = bucket;
		}
		//get the movie info in the requested language
		const detailsResponse = await fetch(
			`https://api.themoviedb.org/3/movie/${cachedMovieId}?language=${tmdbLanguage}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
					Accept: "application/json",
				},
			}
		);

		if (!detailsResponse.ok) {
			return res.status(502).json({ error: "Error communicating with TMDB" });
		}

		const movie = await detailsResponse.json();

		return res.status(200).json({
			id: movie.id,
			title: movie.title,
			overview: movie.overview,
			poster_path: movie.poster_path,
			release_date: movie.release_date,
		});

	} catch (error) {
		console.error("Recommendation error:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

module.exports = { getCurrentRecommendation };