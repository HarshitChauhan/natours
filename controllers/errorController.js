const AppErrorHandler = require("../utils/appErrorHandler");

// Database error to Operational errors conversion
const handleDatabaseCastError = err => { // for invalid Database ID's
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppErrorHandler(message, 400);
  };

const handleDatabaseDuplicateFields = err => { // for duplicate key error
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value conflict occured at database for value: ${value}. Please use unique values only!`;
    return new AppErrorHandler(message, 400);
};

const handleDatabaseValidationError = err => { // for data(req body) validation
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppErrorHandler(message, 400);
};

const handleJWTError = () => new AppErrorHandler('Invalid token! Please log in again.', 401);

const handleJWTExpiredError = () => new AppErrorHandler('Your token has expired! Please log in again.', 401);

// Development error format
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        httpStatus: err.statusCode,
        timeStamp: err.timeStamp,
        errorDetails: {
            //reason: err.reason, // need to take care of [error reason] later
            message: err.message,
            stack: err.stack
        }
    });
}

// Production error format
const sendErrorProd = (err, res) => {
    // Operational errors are trusted, can show details to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            timeStamp: new Date().toISOString(),
            errorDetails: {
                // reason: err.reason, // need to take care of [error reason] later
                message: err.message
            }
        });
    }
    // Programming or other unknown errors should not be populated to client
    else {
        // 1) Log error to console
        console.error('ERROR 💥:', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'Server error',
            message: 'Something went wrong!'
        })

    }

}

// Global Error Handler
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';
    err.timeStamp = req.requestTime || new Date().toISOString();

    // different format of error for each ENV
    if(process.env.NODE_ENV === 'dev'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production'){
        if (err.name === 'CastError') err = handleDatabaseCastError(err);
        if (err.code === 11000) err = handleDatabaseDuplicateFields(err);
        if (err.name === 'ValidationError') err = handleDatabaseValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
        sendErrorProd(err, res);   
    }
  }