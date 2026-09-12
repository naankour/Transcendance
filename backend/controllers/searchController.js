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

	let moviePage = Number(req.query.moviePage);
	if (!Number.isInteger(moviePage) || moviePage <= 0)
		moviePage = 1;

	let personPage = Number(req.query.personPage);
	if (!Number.isInteger(personPage) || personPage <= 0)
		personPage = 1;

	let userPage = Number(req.query.userPage);
	if (!Number.isInteger(userPage) || userPage <= 0)
		userPage = 1;

	const tmdbLanguage = getTmdbLanguage(req.query.lang);

	try {
		const responses = await Promise.all([
			fetch(
				`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=${tmdbLanguage}&page=${moviePage}`,
				{ headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`, Accept: "application/json" } }
			),
			fetch(
				`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=${tmdbLanguage}&page=${personPage}`,
				{ headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`, Accept: "application/json" } }
			),
			prisma.users.findMany({
				where: {
					username: {
						contains: query,
						mode: 'insensitive',
					},
				},
				skip: (userPage - 1) * userLimit,
				take: userLimit + 1,
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
		let movieTotalPages = 0;
		if (movieResponse.ok) {
			const movieData = await movieResponse.json();
			movieResults = movieData.results || [];
			movieTotalPages = movieData.total_pages || 0;
		}

		let personResults = [];
		let personTotalPages = 0;
		if (personResponse.ok) {
			const personData = await personResponse.json();
			personResults = personData.results || [];
			personTotalPages = personData.total_pages || 0;
		}

		movieResults = movieResults.filter((movie) => movie.poster_path !== null);
		movieResults.sort((a, b) => b.popularity - a.popularity);

		const hasMoreMovies = moviePage < movieTotalPages;
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

		const hasMorePeople = personPage < personTotalPages;
		personResults = personResults.slice(0, personLimit);

		const people = personResults.map((person) => ({
			id: person.id,
			name: person.name,
			profile_path: person.profile_path,
		}));

		const hasMoreUsers = userResults.length > userLimit;
		const trimmedUsers = userResults.slice(0, userLimit);

		const users = trimmedUsers.map((user) => ({
			id: user.id,
			username: user.username,
			avatar_url: user.avatar_url,
		}));

		return res.status(200).json({
			movies,
			people,
			users,
			hasMoreMovies,
			hasMorePeople,
			hasMoreUsers,
		});

	} catch (error) {
		console.error("Combined search error:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

module.exports = { searchAll };