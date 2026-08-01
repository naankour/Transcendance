
const jwt = require('jsonwebtoken'); 

// ----- vérifie si le user a un jeton valide avant de lui laisser l'accès aux routes protégées ----- //

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // on récupère le token

  if (!token) { // si pas de token -> erreur
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try { // si token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // on vérifie le token du user
    req.user = decoded; // on met les infos du user dans req.user 
    next(); // feu vert on passe à la suite
  } catch (error) { // pas de token ou token expiré
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;