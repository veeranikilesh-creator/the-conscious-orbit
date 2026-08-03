/** Error carrying an HTTP status, so controllers can throw and the
 *  error middleware can map it to a response without guessing. */
export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static notFound(what = 'Resource') {
    return new ApiError(404, `${what} not found`);
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }
}
