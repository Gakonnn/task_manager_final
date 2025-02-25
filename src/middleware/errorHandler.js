const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.name}: ${err.message}`);

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    if (err.name === 'AuthError') {
        statusCode = 401;
        message = 'Authentication failed';
    }

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
