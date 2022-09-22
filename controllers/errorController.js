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
const sendErrorProd = (err, res) => {
    // Operational errors are trusted, can show details to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            timeStamp: err.timeStamp,
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

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';
    err.timeStamp = req.requestTime || new Date().toISOString();

    // different format of error for each ENV
    if(process.env.NODE_ENV === 'dev'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'prod'){
        sendErrorProd(err, res);
    } 
  }