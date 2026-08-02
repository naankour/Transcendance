const { getTmdbLanguage } = require('../utils/tmdbLang');
const prisma = require('../prisma/prismaClient.js');

const searchAll = async (req, res) => {
	let query = req.params.query;

	if (query)
		query = query.trim();

	if (!query)
		return res.status(400).json({ error: "Search query is required" });

	let movieLimit = Number(req.query.movieLimit);
	if (!Number.isInteger(movieLimit) || movieLimit <= 0)
		movieLimit = 5;

	let personLimit = Number(req.query.personLimit);
	if (!Number.isInteger(personLimit) || personLimit <= 0)
		personLimit = 2;

	let userLimit = Number(req.query.userLimit);
	if (!Number.isInteger(userLimit) || userLimit <= 0)
		userLimit = 2;

    const tmdbLanguage = getTmdbLanguage(req.query.lang);

	try {
		const responses = await Promise.all([
			fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=${tmdbLanguage}`, {
				headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`, Accept: "application/json" },
			}),
			fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=${tmdbLanguage}`, {
				headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`, Accept: "application/json" },
			}),
			prisma.users.findMany({
				where: {
					username: {
						contains: query,
						mode: 'insensitive',
					},
				},
				take: userLimit,
				select: {
					id: true,
					username: true,
					avatar_url: true,
				},
			}),
		]);

		const movieResponse = responses[0];
		const personResponse = responses[1];
		const userResults = responses[2];

		let movieResults = [];
		if (movieResponse.ok) {
			const movieData = await movieResponse.json();
			movieResults = movieData.results || [];
		}

		let personResults = [];
		if (personResponse.ok) {
			const personData = await personResponse.json();
			personResults = personData.results || [];
		}

		movieResults = movieResults.filter((movie) => movie.poster_path !== null);
		movieResults.sort((a, b) => b.popularity - a.popularity);
		movieResults = movieResults.slice(0, movieLimit);

		const movies = movieResults.map((movie) => ({
			id: movie.id,
			title: movie.title,
			release_date: movie.release_date,
			poster_path: movie.poster_path,
		}));

		personResults = personResults.filter((person) => {
			const hasPhoto = person.profile_path !== null;
			const hasKnownFor = person.known_for && person.known_for.length > 0;
			return hasPhoto || hasKnownFor;
		});
		personResults.sort((a, b) => b.popularity - a.popularity);
		personResults = personResults.slice(0, personLimit);

		const people = personResults.map((person) => ({
			id: person.id,
			name: person.name,
			profile_path: person.profile_path,
		}));

		const users = userResults.map((user) => ({
			id: user.id,
			username: user.username,
			avatar_url: user.avatar_url,
		}));

		return res.status(200).json({ movies, people, users });

	} catch (error) {
		console.error("Combined search error:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

module.exports = { searchAll };