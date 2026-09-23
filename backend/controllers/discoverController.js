const getMovies = async (req, res) => {
    try {

    const params = new URLSearchParams();

    const genre = Number(req.query.genre);
    const year = Number(req.query.year);
    const sort = req.query.sort_by;
    const page = Number(req.query.page) || 1;
    const language = req.query.language;

    const genreArray = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
   const validType = [
            "popularity.desc", "popularity.asc",
            "primary_release_date.asc", "primary_release_date.desc",
            "vote_average.desc", "vote_average.asc"
        ];
    const validLanguages = ["en", "fr", "es", "ja", "ko", "de", "it"];


    params.append("page", page);

    if (genreArray.includes(genre))
        params.append("with_genres", genre);
    if (!isNaN(year) && year <= 2026 && year >= 1888)
    {
            params.append("primary_release_year", year);
    }
    if (validType.includes(sort))
        params.append("sort_by", sort);

    if (validLanguages.includes(language)) {
            params.append("with_original_language", language);
    }
    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;

    const request = await fetch(url , 
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
        }
    );

    if (!request.ok)
    {
         return res.status(502).send('Error: problem encountered while trying to fetch data from tmdb');
    }

    const data = await request.json();

    return res.status(200).json(data);
    }
    catch (error)
    {
        console.error("Error: ", error);
        return res.status(500).json({ error: "Server error" });
    }
}

const getGenre = async (req, res) => {
    try {
    const language = req.query.language;
    const validLanguages = ["en-US", "fr-FR", "es-ES"];

    const params = new URLSearchParams();

    if (validLanguages.includes(language)) {
        params.append("language", language);
    } else {
        params.append("language", "en-US");
    }

    const request = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${params.toString()}`, 
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
        }
    );

    if (!request.ok)
    {
         return res.status(502).send('Problem encountered while trying to fetch data from tmdb');
    }

    const data = await request.json();

    if (data.genres.length == 0)
    {
        return res.status(404).send('Error: NO data was found');
    }
    return res.status(200).json(data);
    }
    catch (error)
    {
        console.error("Error: ", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

module.exports = {getMovies, getGenre};
