// GET /actors/search/:name
// Cherche des acteurs sur TMDB par nom
const searchActor = async (req, res) => {
  const name = req.params.name?.trim();

  if (!name) {
    return res.status(400).json({
      error: "Le nom de l'acteur est requis",
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

// GET /actors/:tmdbId
// Renvoie la fiche complète d'un acteur avec sa filmographie
const getActorById = async (req, res) => {
  const tmdbId = Number(req.params.tmdbId);

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    return res.status(400).json({
      error: "Identifiant TMDB invalide",
    });
  }

  try {
    const [detailsResponse, creditsResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${tmdbId}?language=fr-FR`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          Accept: "application/json",
        },
      }),
      fetch(`https://api.themoviedb.org/3/person/${tmdbId}/movie_credits?language=fr-FR`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          Accept: "application/json",
        },
      }),
    ]);

    if (detailsResponse.status === 404) {
      return res.status(404).json({
        error: "Acteur introuvable sur TMDB",
      });
    }

    if (!detailsResponse.ok || !creditsResponse.ok) {
      return res.status(502).json({
        error: "Erreur lors de la communication avec TMDB",
      });
    }

    const details = await detailsResponse.json();
    const credits = await creditsResponse.json();

    // trié par date 
    const filmography = (credits.cast || []).sort((a, b) => {
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return b.release_date.localeCompare(a.release_date);
    });

    details.filmography = filmography;

    return res.status(200).json(details);

  } catch (error) {
    console.error("Erreur récupération acteur :", error);
    return res.status(500).json({
      error: "Erreur serveur",
    });
  }
};

module.exports = { searchActor, getActorById };