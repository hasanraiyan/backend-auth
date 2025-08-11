class ApiError extends Error {
  constructor(message="Something went wrong", statusCode, errors=[], stack="") {
    super(message);
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }   
  }
}

export { ApiError };