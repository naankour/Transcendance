// const getMoviesFromGenre = async (req, res) => {
//     try {

//     let id = Number(req.query.id);
//     if (!id || isNaN(id))
//         return res.status(400).send('Error: Bad Request');

//     const request = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}`, 
//         {
//             headers: {
//                 Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
//             },
//         }
//     );

//     if (!request.ok)
//     {
//          return res.status(502).send('Error: problem encountered while trying to fetch data from tmdb');
//     }

//     const data = await request.json();

//     let results = data.results;
//     if (!results || results.length == 0)
//     {
//         return res.status(502).send('Error: not a single genre matches this genre_id');
//     }
//         // console.log(data.id);
//     return res.status(200).json(data);
//     }
//     catch (error)
//     {
//         console.error("Error: ", error);
//         return res.status(500).json({ error: "Erreur serveur" });
//     }
// }

// const getMoviesFromYear = async (req, res) => {
//     try {

//     const year = Number(req.query.date);   
//     if (isNaN(year) || year > 2026 || year < 1888)
//         return res.status(400).send('Error: Bad Request');

//     const request = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}`, 
//         {
//             headers: {
//                 Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
//             },
//         }
//     );

//     if (!request.ok)
//     {
//          return res.status(502).send('Error: problem encountered while trying to fetch data from tmdb');
//     }

//     const data = await request.json();

//     let results = data.results;
//     if (results && results.length == 0)
//     {
//         return res.status(502).send('Error: not a single genre matches this genre_id');
//     }
//         // console.log(data.id);
//     return res.status(200).json(data);
//     }
//     catch (error)
//     {
//         console.error("Error: ", error);
//         return res.status(500).json({ error: "Erreur serveur" });
//     }
// }

// const sortMovies = async (req, res) => {
//     try {
//     let sortType = req.query.sort_by;
//     const validType = ["popularity.desc", "popularity.asc", "primary_release_date.asc", "primary_release_date.desc"];

//     if (!validType.includes(sortType))
//                 return res.status(400).send('Error: Bad Request');

//     const request = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=${sortType}`, 
//         {
//             headers: {
//                 Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
//             },
//         }
//     );

//     if (!request.ok)
//     {
//          return res.status(502).send('Error: problem encountered while trying to fetch data from tmdb');
//     }

//     const data = await request.json();

//     let results = data.results;
//     if (!results || results.length == 0)
//     {
//         return res.status(502).send('Error: not a single genre matches this genre_id');
//     }
//         // console.log(data.id);
//     return res.status(200).json(data);
//     }
//     catch (error)
//     {
//         console.error("Error: ", error);
//         return res.status(500).json({ error: "Erreur serveur" });
//     }
// }

const getMovies = async (req, res) => {
    try {

    // let id = req.params.sortType;
    const params = new URLSearchParams();

    const genre = Number(req.query.genre);
    const year = Number(req.query.year);
    const sort = req.query.sort_by;
    const page = Number(req.query.page) || 1;
    // const minRating = Number(req.query.min_rating);
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
    // if (!isNaN(minRating) && minRating >= 0 && minRating <= 10) {
    //         params.append("vote_average.gte", minRating);
    //         params.append("vote_count.gte", 50);
    // }
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

    // let results = data.results;
    // if (!results || results.length == 0)
    // {
    //     return res.status(502).send('Error: Bad data request');
    // }
        // console.log(data.id);
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
    const request = await fetch('https://api.themoviedb.org/3/genre/movie/list', 
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

    // let results = data.genres;
    if (data.genres.length == 0)
    {
        return res.status(404).send('Error: NO data was found');
    }
        // console.log(data.id);
    return res.status(200).json(data);
    }
    catch (error)
    {
        console.error("Error: ", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

module.exports = {getMovies, getGenre};
