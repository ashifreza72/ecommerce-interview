const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get admin from token
      const admin = await Admin.findByPk(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: 'Access denied. Admin not found.' });
      }

      // Add admin to request object
      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = authMiddleware;
