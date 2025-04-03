const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to authenticate JWT tokens
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Invalid token format.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user exists and isn't deleted
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          deletedAt: null
        }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found or account deleted.' });
      }

      // Check if user's auth record is valid
      const auth = await prisma.userAuth.findFirst({
        where: {
          userId: user.id,
          deletedAt: null
        }
      });

      if (!auth) {
        return res.status(401).json({ message: 'Authentication record not found.' });
      }

      // Add user info to request object
      req.user = {
        userId: user.id,
        email: auth.email,
        isEmailVerified: auth.isEmailVerified
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token. Please login again.' });
      }
      
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Optional: Middleware to verify email is confirmed
exports.requireEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ 
      message: 'Please verify your email address before accessing this resource.' 
    });
  }
  next();
};

// Optional: Admin role middleware if you implement roles later
exports.requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};