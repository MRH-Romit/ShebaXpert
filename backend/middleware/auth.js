const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate JWT token
exports.authenticateToken = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Middleware to check admin role
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Middleware to check service provider role
exports.isServiceProvider = (req, res, next) => {
  if (req.userRole !== 'service_provider' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Service provider privileges required.' });
  }
  next();
};