class ApiError extends Error {
    constructor(
        message,
        errors = [],
        statusCode,
        stack = ''
    ) {
        super(message);
        this.data = null;
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export  {ApiError};