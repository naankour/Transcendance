// GET /actors/search/:name
// Cherche des acteurs sur TMDB par nom
const searchActor = async (req, res) => {
	let name = req.params.name;

	if (name)
		name = name.trim();

	if (!name)
		return res.status(400).json({ error: "Actor name is required"});

	try {
		const searchResponse = await fetch(
			`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(name)}&language=en-US`,
			{
				headers: {
					Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
					Accept: "application/json",
				},
			}
		);

		if (!searchResponse.ok)
			return res.status(502).json({ error: "Error communicating with TMDB" });

		const searchData = await searchResponse.json();

		let results = searchData.results;
		if (!results)
			results = [];

		results = results.filter((person) => {
			const hasPhoto = person.profile_path !== null;
			const hasKnownFor = person.known_for && person.known_for.length > 0;
			return hasPhoto || hasKnownFor;
		});

		results.sort((a, b) => b.popularity - a.popularity);

		if (results.length === 0)
			return res.status(404).json({ error: "No actor found" });

		return res.status(200).json(results);

	} catch (error) {
		console.error("Actor search error:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

// GET /actors/:tmdbId
// Renvoie la fiche complète d'un acteur avec sa filmographie
const getActorById = async (req, res) => {
	
	const tmdbId = Number(req.params.tmdbId);

	if (!Number.isInteger(tmdbId) || tmdbId <= 0)
		return res.status(400).json({ error: "Invalid TMDB id" });

	try {
		const responses = await Promise.all([
			fetch(`https://api.themoviedb.org/3/person/${tmdbId}?language=en-US`, {
				headers: {
					Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
					Accept: "application/json",
				},
			}),
			fetch(`https://api.themoviedb.org/3/person/${tmdbId}/movie_credits?language=en-US`, {
				headers: {
					Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
					Accept: "application/json",
				},
			}),
		]);

		const detailsResponse = responses[0];
		const creditsResponse = responses[1];

		if (detailsResponse.status === 404)
			return res.status(404).json({ error: "Actor not found on TMDB" });

		if (!detailsResponse.ok || !creditsResponse.ok) 
			return res.status(502).json({ error: "Error communicating with TMDB" });

		const details = await detailsResponse.json();
		const credits = await creditsResponse.json();

		const actingCredits = (credits.cast || [])
		.filter((movie) => {
			const character = movie.character || '';
			return !character.toLowerCase().startsWith('self');
		})
		.map((movie) => ({
			id: movie.id,
			title: movie.title,
			release_date: movie.release_date,
			role: "Actor",
			detail: movie.character || null,
		}));
		 
			const directingCredits = (credits.crew || [])
			.filter((movie) => movie.job === "Director")
			.map((movie) => ({
				id: movie.id,
				title: movie.title,
				release_date: movie.release_date,
				role: "Director",
				detail: null,
			}));
		 
			const filmography = [...actingCredits, ...directingCredits].sort((a, b) => {
			if (!a.release_date) return 1;
			if (!b.release_date) return -1;
			return b.release_date.localeCompare(a.release_date);
			});
		 
			details.filmography = filmography;
		 
			return res.status(200).json(details);

	} catch (error) {
		console.error("Actor fetch error:", error);
		return res.status(500).json({error: "Server error"});
	}
};

module.exports = { searchActor, getActorById };