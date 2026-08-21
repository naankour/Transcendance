const prisma = require('../prisma/prismaClient');

const getWatchlist = async (req, res) => 
{
    try 
    {
        const user_id = req.user.id;

        const watchlist = await prisma.watchlist.findMany({
            where: {
                user_id: user_id
            },
            include: {
                movies: true
            }
        });

        res.status(200).json(watchlist);
    }
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};


const addToWatchlist = async(req, res) =>
{
    try
    {
        const user_id = req.user.id;
        const movie_id = parseInt(req.params.movie_id);

        const existingWatchlist = await prisma.watchlist.findUnique({
            where: {
                user_id_movie_id: {
                    user_id,
                    movie_id
                }
            }
        });

        if (existingWatchlist)
        {
            return res.status(409).json({
                error: "Movie already in watchlist"
            });
        }
        
        const watchlist = await prisma.watchlist.create({
            data: {
                user_id,
                movie_id
            }
        });

        res.status(201).json(watchlist);
    }
    catch (error)
    {
        res.status(500).json({
            error: error.message
        });
    }
};


const removeFromWatchlist = async(req, res) =>
{
    try
    {
        const user_id = req.user.id;
        const movie_id = parseInt(req.params.movie_id);

        const watchlist = await prisma.watchlist.delete({
            where: {
                user_id_movie_id: {
                    user_id,
                    movie_id
                }
            }
        });

        res.status(200).json({
            message: "Movie removed from watchlist",
            watchlist
        });
    }
    catch (error)
    {
        res.status(500).json({
            error: error.message
        });
    }
};

const getWatchlistByUserId = async (req, res) => {
    try {
        const user_id = parseInt(req.params.userId);

        const watchlist = await prisma.watchlist.findMany({
            where: {
                user_id: user_id
            },
            include: {
                movies: true
            }
        });
        res.status(200).json(watchlist);
    }
    catch (error)
    {
        console.error('Error in getWatchlistByUserId:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlistByUserId
};
