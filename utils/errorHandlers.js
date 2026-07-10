const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'Fail': 'Error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    };
};

module.exports = {AppError, asyncHandler};