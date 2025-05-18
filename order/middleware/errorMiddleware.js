// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages });
    }
    
    res.status(500).json({ message: 'Server Error' });
  };
  
  module.exports = { errorHandler };