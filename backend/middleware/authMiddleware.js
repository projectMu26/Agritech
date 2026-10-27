import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agritech_secret_jwt_key_2026');

      // Fetch user without password
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // DB not connected fallback
      }

      if (!req.user) {
        const demoDefaults = {
          '671e72300000000000000001': { _id: '671e72300000000000000001', name: 'Gurpreet Singh', email: 'farmer@agritech.com', role: 'farmer' },
          '671e72300000000000000002': { _id: '671e72300000000000000002', name: 'Dr. Vikram Patel', email: 'admin@agritech.com', role: 'admin' },
          '671e72300000000000000003': { _id: '671e72300000000000000003', name: 'Dr. Sunita Deshmukh', email: 'expert@agritech.com', role: 'expert' },
        };
        req.user = demoDefaults[decoded.id] || { _id: decoded.id, name: 'Demo Farmer', role: 'farmer' };
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin authorization required' });
  }
};

export const expertOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'expert' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Expert or Admin authorization required' });
  }
};
