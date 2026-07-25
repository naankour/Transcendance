const prisma = require('../prisma/prismaClient');

const getFavorites = async(req, res) => 
{
    try {
        const user_id = 1 //req.user.id; 

        const favorites = await prisma.favorites.findMany({
        where: {
            user_id
        }
    });
    res.json(favorites);
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addFavorite = async(req, res) => 
{
    try 
    {
        const user_id = 1 //req.user.id;
        const movie_id = parseInt(req.params.movie_id);

        const favorite = await prisma.favorites.create({
            data: {
                user_id,
                movie_id
            }
        });
        res.status(201).json(favorite);
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
};

const removeFavorite = async(req, res) =>
{
    try 
    {
        const user_id = 1 //req.user.id;
        const movie_id = parseInt(req.params.movie_id);

        const favorite = await prisma.favorites.delete({
            where: {
                user_id_movie_id: {
                    user_id,
                    movie_id
                }
            }
        });
        res.status(200).json({ message: "Favorite removed successfully", favorite});
    } 
    catch (error) 
    {
        res.status(404).json({ error: "Favorite not found" });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };