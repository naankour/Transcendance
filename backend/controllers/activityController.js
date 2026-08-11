const prisma = require('../prisma/prismaClient');

const getFriendsActivity = async (req, res) => {
	
	try {
		let limit = Number(req.query.limit);
		if (!Number.isInteger(limit) || limit <= 0) {
			limit = 5;
		}

		const currentUserId = req.user.id;

		const follows = await prisma.follows.findMany({
			where: { follower_id: currentUserId },
			select: { followed_id: true },
		});

		const followedIds = follows.map((follow) => follow.followed_id);

		if (followedIds.length === 0) {
			return res.status(200).json([]);
		}

		const userSelect = {
			select: { id: true, username: true, avatar_url: true },
		};

		const results = await Promise.all([
			prisma.reviews.findMany({
				where: { user_id: { in: followedIds } },
				orderBy: { created_at: 'desc' },
				take: limit,
				include: { movies: true, users: userSelect },
			}),
			prisma.watchlist.findMany({
				where: { user_id: { in: followedIds } },
				orderBy: { created_at: 'desc' },
				take: limit,
				include: { movies: true, users: userSelect },
			}),
			prisma.favorites.findMany({
				where: { user_id: { in: followedIds } },
				orderBy: { created_at: 'desc' },
				take: limit,
				include: { movies: true, users: userSelect },
			}),
			prisma.follows.findMany({
				where: { follower_id: { in: followedIds } },
				orderBy: { created_at: 'desc' },
				take: limit,
				include: {
					users_follows_follower_idTousers: userSelect,
					users_follows_followed_idTousers: userSelect,
				},
			}),
		]);

		const reviewItems = results[0].map((review) => ({
			type: 'review',
			created_at: review.created_at,
			movie: review.movies,
			user: review.users,
			rating: review.rating,
		}));

		const watchlistItems = results[1].map((entry) => ({
			type: 'watchlist',
			created_at: entry.created_at,
			movie: entry.movies,
			user: entry.users,
		}));

		const favoriteItems = results[2].map((entry) => ({
			type: 'favorite',
			created_at: entry.created_at,
			movie: entry.movies,
			user: entry.users,
		}));

		const followItems = results[3].map((follow) => ({
			type: 'follow',
			created_at: follow.created_at,
			user: follow.users_follows_follower_idTousers,
			targetUser: follow.users_follows_followed_idTousers,
		}));
		
		const feed = [...reviewItems, ...watchlistItems, ...favoriteItems, ...followItems];


		feed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

		const limitedFeed = feed.slice(0, limit);

		return res.status(200).json(limitedFeed);

	} catch (error) {
		console.error("Friends activity error:", error);
		return res.status(500).json({ error: "Server error" });
	}
};

module.exports = { getFriendsActivity };
