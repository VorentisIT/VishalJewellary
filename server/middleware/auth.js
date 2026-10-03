import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'aurelia_secret_key_development_only';
      const decoded = jwt.verify(token, jwtSecret);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Not authorized: Invalid token payload' });
      }

      // Handle standalone in-memory demo IDs
      if (decoded.id === 'mem_admin_1') {
        req.user = { _id: 'mem_admin_1', name: 'AURÉLIA Admin', email: 'admin@gmail.com', role: 'admin' };
        return next();
      }

      if (typeof decoded.id === 'string' && decoded.id.startsWith('mem_')) {
        req.user = { _id: decoded.id, name: 'Priya Sharma', email: 'priya@example.com', role: 'customer' };
        return next();
      }

      // Check active database if connection is ready
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'User account not found or has been deactivated' });
        }
        return next();
      }

      // Default fallback user object if valid token exists
      req.user = { _id: decoded.id, role: 'customer' };
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ message: 'Not authorized: Token verification failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized: Access token required' });
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Administrative privileges required' });
};

