const prisma = require('../prisma/prismaClient');

const getWatchlist = async(req, res) =>
{
    try
    {
        const user_id = req.user.id;

        const watchlist = await prisma.watchlist.findMany({
            where: {
                user_id
            }
        });

        res.status(200).json(watchlist);
    }
    catch (error)
    {
        res.status(500).json({
            error: error.message
        });
    }
};


const addToWatchlist = async(req, res) =>
{
    try
    {
        const user_id = req.user.id;
        const movie_id = parseInt(req.params.movie_id);

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


module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
};
