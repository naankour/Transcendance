const { pool } = require('../config/db');

// GET /actors/search/:name
// Cherche des acteurs sur TMDB par nom
const searchActor = async (req, res) => {
	const name = req.params.name?.trim();
	
	if (!name) {
		return res.status(400).json({
		error: "Le nom de l’acteur est requis",
		});
	}
	
	try {
		const searchResponse = await fetch(
		`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(name)}&language=fr-FR`,
		{
			headers: {
			Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
			Accept: "application/json",
			},
		}
		);
	
		if (!searchResponse.ok) {
		return res.status(502).json({
			error: "Erreur lors de la communication avec TMDB",
		});
		}
	
		const searchData = await searchResponse.json();
	
		if (!searchData.results?.length) {
		return res.status(404).json({
			error: "Aucun acteur trouvé",
		});
		}
	
		return res.status(200).json(searchData.results);
	} catch (error) {
		console.error("Erreur recherche acteur :", error);
	
		return res.status(500).json({
		error: "Erreur serveur",
		});
	}
	};

// POST /actors/import/:tmdbId
// Va chercher un acteur précis sur TMDB par son id TMDB et l'enregistre en DB
const importActor = async (req, res) => {
	const tmdbId = Number(req.params.tmdbId);
	
	if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
		return res.status(400).json({
		error: "Identifiant TMDB invalide",
		});
	}
	
	try {
		const response = await fetch(
		`https://api.themoviedb.org/3/person/${tmdbId}?language=fr-FR`,
		{
			headers: {
			Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
			Accept: "application/json",
			},
		}
		);
	
		if (response.status === 404) {
		return res.status(404).json({
			error: "Acteur introuvable sur TMDB",
		});
		}
	
		if (!response.ok) {
		return res.status(502).json({
			error: "Erreur lors de la communication avec TMDB",
		});
		}
	
		const actor = await response.json();
	
		const result = await pool.query(
		`INSERT INTO actors (
			tmdb_id,
			name,
			biography,
			birthday,
			deathday,
			place_of_birth,
			gender,
			known_for_department,
			profile_path,
			imdb_id,
			also_known_as
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	
		ON CONFLICT (tmdb_id) DO UPDATE SET
			name = EXCLUDED.name,
			biography = EXCLUDED.biography,
			birthday = EXCLUDED.birthday,
			deathday = EXCLUDED.deathday,
			place_of_birth = EXCLUDED.place_of_birth,
			gender = EXCLUDED.gender,
			known_for_department = EXCLUDED.known_for_department,
			profile_path = EXCLUDED.profile_path,
			imdb_id = EXCLUDED.imdb_id,
			also_known_as = EXCLUDED.also_known_as,
			updated_at = CURRENT_TIMESTAMP
	
		RETURNING *`,
		[
			actor.id,
			actor.name,
			actor.biography || null,
			actor.birthday || null,
			actor.deathday || null,
			actor.place_of_birth || null,
			actor.gender ?? null,
			actor.known_for_department || null,
			actor.profile_path || null,
			actor.imdb_id || null,
			actor.also_known_as || [],
		]
		);
	
		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Erreur import acteur :", error);
	
		return res.status(500).json({
		error: "Erreur serveur lors de l’import de l’acteur",
		});
	}
	};

	// GET /actors/:id
	// Renvoie un acteur déjà présent en DB, avec sa filmographie 
const getActorById = async (req, res) => {
	const id = Number(req.params.id);
	
	if (!Number.isInteger(id) || id <= 0) {
		return res.status(400).json({
		error: "Identifiant invalide",
		});
	}
	
	try {
		const actorResult = await pool.query(
		'SELECT * FROM actors WHERE id = $1',
		[id]
		);
	
		if (actorResult.rows.length === 0) {
		return res.status(404).json({ error: "Acteur introuvable en base" });
		}
	
		const actor = actorResult.rows[0];
	
		const filmographyResult = await pool.query(
		`SELECT movies.id, movies.title, movies.poster, movies.release_date,
				movie_actor.character_name
		 FROM movie_actor
		 JOIN movies ON movies.id = movie_actor.movie_id
		 WHERE movie_actor.actor_id = $1
		 ORDER BY movies.release_date DESC`,
		[id]
		);
	
		actor.filmography = filmographyResult.rows;
	
		return res.status(200).json(actor);
	
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Erreur serveur" });
	}
	};

module.exports = { searchActor, importActor, getActorById };