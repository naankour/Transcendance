const prisma = require('../prisma/prismaClient.js');
const jwt = require('jsonwebtoken'); 


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({ where: { id: decoded.id } }); 
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    req.user = decoded; 
    next();
  } catch (error) { 
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;