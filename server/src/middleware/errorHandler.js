import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `No route for ${req.method} ${req.originalUrl}`));
}

/* eslint-disable no-unused-vars -- Express identifies error middleware by arity. */
export function errorHandler(err, _req, res, _next) {
  // Zod validation — surface which fields failed so callers can fix the payload.
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'ValidationError',
      message: 'Request payload failed validation',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message, code: i.code })),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'BadRequest', message: `Malformed ${err.path}: "${err.value}"` });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json({
      error: 'ValidationError',
      message: err.message,
      issues: Object.entries(err.errors).map(([path, e]) => ({ path, message: e.message })),
    });
  }

  // Duplicate key (e.g. re-running a module without upsert).
  if (err?.code === 11000) {
    return res.status(409).json({ error: 'Conflict', message: 'Resource already exists', keys: err.keyValue });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.statusCode >= 500 ? 'ServerError' : 'RequestError',
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  console.error('[unhandled]', err);
  return res.status(500).json({
    error: 'ServerError',
    message: isProduction ? 'Something went wrong' : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
