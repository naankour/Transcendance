const prisma = require('../prisma/prismaClient');

const getFollows = async(req, res) =>
{
    try
    {
        const user_id = req.user.id;

        const follows = await prisma.follows.findMany({
            where: {
                follower_id: user_id
            },
            include: {
                users_follows_followed_idTousers: true
            }
        });
        res.status(200).json(follows);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}

const addFollow = async(req, res) =>
{
    try
    {
        const follower_id = req.user.id;
        const followed_id = parseInt(req.params.user_id);

        if (follower_id === followed_id) {
            return res.status(400).json({ error: "You cannot follow yourself" })
        }
        const follow = await prisma.follows.create({
            data: {
                follower_id,
                followed_id
            }
        });
        res.json(follow);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}

const removeFollow = async(req, res) =>
{
    try
    {    
        const follower_id = req.user.id;
        const followed_id = parseInt(req.params.user_id);

        const follow = await prisma.follows.delete({
            where: {
                follower_id_followed_id: {
                    follower_id,
                    followed_id
                }
            }  
        });
        res.json(follow);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getFollows, addFollow, removeFollow };