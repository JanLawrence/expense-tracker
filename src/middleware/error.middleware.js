// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
    // Log the error for server-side debugging
    console.error(err.stack);
  
    // Check if this is a Prisma error
    if (err.name === 'PrismaClientKnownRequestError') {
      // Handle specific Prisma error codes
      switch (err.code) {
        case 'P2002': // Unique constraint violation
          return res.status(409).json({
            status: 'error',
            message: 'A record with this information already exists.',
            details: err.meta?.target || 'Unique constraint violation'
          });
        
        case 'P2003': // Foreign key constraint failure
          return res.status(400).json({
            status: 'error',
            message: 'Related record not found.',
            details: err.meta?.field_name || 'Foreign key constraint failed'
          });
        
        case 'P2025': // Record not found
          return res.status(404).json({
            status: 'error',
            message: 'Record not found.',
            details: err.meta?.cause || 'Requested record does not exist'
          });
        
        default:
          return res.status(500).json({
            status: 'error',
            message: 'Database operation failed.',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
          });
      }
    }
  
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authentication token.',
        details: 'Please login again.'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token expired.',
        details: 'Please login again.'
      });
    }
  
    // Handle validation errors that might have been missed
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed.',
        details: err.details || err.message
      });
    }
  
    // Handle specific status code errors if set
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    // Only include stack trace in development environment
    const errorResponse = {
      status: 'error',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
  
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = errorMiddleware;