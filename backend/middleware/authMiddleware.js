const prisma = require('../prisma/prismaClient.js');
const jwt = require('jsonwebtoken'); 

// ----- vérifie si le user a un jeton valide avant de lui laisser l'accès aux routes protégées ----- //

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // on récupère le token

  if (!token) { // si pas de token -> erreur
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try { // si token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // on vérifie le token du user
    const user = await prisma.users.findUnique({ where: { id: decoded.id } }); // on vérifie si le user existe dans la db
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    req.user = decoded; // on met les infos du user dans req.user 
    next(); // feu vert on passe à la suite
  } catch (error) { // pas de token ou token expiré
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;