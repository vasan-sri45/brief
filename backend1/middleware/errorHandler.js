// middlewares/error.js
import { AppError } from '../utils/appError.js';

export const notFound = (req, res, next) => {
  // Pass a structured operational error to the centralized handler
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
};

const formatMongooseError = (err) => {
  // Invalid ObjectId / cast failures
  if (err.name === 'CastError') {
    return {
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`,
      code: 'CAST_ERROR',
    };
  }

  // Mongoose validation aggregation
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map(e => ({
      path: e.path,
      kind: e.kind,
      message: e.message,
      value: e.value
    }));
    return {
      statusCode: 400,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors
    };
  }

  // Mongo duplicate key errors surfaced via Mongoose (E11000/DuplicateKey)
  if (err.code === 11000 || err.code === 'DuplicateKey') {
    const fields = Object.keys(err.keyValue || {});
    return {
      statusCode: 409,
      message: `Duplicate value for ${fields.join(', ')}`,
      code: 'DUPLICATE_KEY',
      errors: fields.map(f => ({ path: f, value: err.keyValue?.[f] }))
    };
  }

  return null;
};

const formatJwtError = (err) => {
  if (err.name === 'TokenExpiredError') {
    return { statusCode: 401, message: 'Token expired', code: 'TOKEN_EXPIRED' };
  }
  if (err.name === 'JsonWebTokenError') {
    return { statusCode: 401, message: 'Invalid token', code: 'INVALID_TOKEN' };
  }
  if (err.name === 'NotBeforeError') {
    return { statusCode: 401, message: 'Token not active', code: 'TOKEN_NOT_ACTIVE' };
  }
  return null;
};

// Central error handler
export const errorHandler = (err, req, res, next) => {
  // Delegate to Express' default handler if headers already sent
  if (res.headersSent) return next(err);

  // Derive base status/message from error or response state
  let statusCode = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let code = err.code;
  let message = err.message || 'Internal Server Error';
  let errors;

  // Known frameworks/libraries
  const m = formatMongooseError(err);
  if (m) ({ statusCode, message, code, errors } = m);

  const j = formatJwtError(err);
  if (j) ({ statusCode, message, code } = j);

  // Optionally handle JSON parse errors from body parsing
  if (!m && !j && err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON payload';
    code = 'BAD_JSON';
  }

  const payload = {
    success: false,
    message,
    code,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  };

  res.status(statusCode).json(payload);
};
