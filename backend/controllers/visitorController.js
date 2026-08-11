const prisma = require('../prisma/prismaClient');

const incrementAndGetVisitors = async (req, res) => {
	try {
		const stats = await prisma.visitor_stats.upsert({
			where: { id: 1 },
			update: { count: { increment: 1 } },
			create: { id: 1, count: 1 },
		});
		return (res.status(200).json({ count: stats.count }));

	} catch (error) {
		console.error("Visitor counter error:", error);
		return (res.status(500).json({ error: "Server error" }));
	}
};

const getVisitorCount = async (req, res) => {
	try {
		const stats = await prisma.visitor_stats.findUnique({ where: { id: 1 } });

		let count = 0;
		if (stats)
			count = stats.count;

		return (res.status(200).json({ count }));
        
	} catch (error) {
		console.error("Visitor counter error:", error);
		return (res.status(500).json({ error: "Server error" }));
	}
};

module.exports = { incrementAndGetVisitors, getVisitorCount };