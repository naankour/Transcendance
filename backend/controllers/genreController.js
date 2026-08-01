const getMoviesFromGenre = async (req, res) => {
    try {

    let id = req.params.id;
    const request = await fetch(`https://api.themoviedb.org/3/discover/movie?&with_genres=${id}`, 
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

    let results = data.results;
    if (results.length == 0)
    {
        return res.status(502).send('Error: not a single genre matches this genre_id');
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

module.exports = {getMoviesFromGenre, getGenre};
