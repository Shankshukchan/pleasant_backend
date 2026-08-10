const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = {
      message: field ? `A record with this ${field} already exists` : 'Duplicate field value entered',
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach((val) => { errors[val.path] = val.message; });
    error = {
      message: Object.values(errors)[0] || 'Validation failed',
      errors,
      statusCode: 400
    };
  }

  // JSON body parse error
  if (err.type === 'entity.parse.failed') {
    error = { message: 'Invalid JSON payload', statusCode: 400 };
  }

  // Payload too large
  if (err.type === 'entity.too.large') {
    error = { message: 'Payload too large. Please upload smaller files.', statusCode: 413 };
  }

  const payload = {
    success: false,
    error: error.message || 'Server Error'
  };
  if (error.errors) payload.errors = error.errors;

  res.status(error.statusCode || 500).json(payload);
};

module.exports = errorHandler;
