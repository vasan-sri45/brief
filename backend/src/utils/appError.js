export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // mark as expected/handled error
    if (details) this.details = details;
  }
}