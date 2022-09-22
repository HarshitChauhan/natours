module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';
  
    res.status(err.statusCode).json({
      status: err.status,
      timeStamp: req.requestTime,
      errorDetails: {
          reason: err.reason, // need to take care of [error reason] later
          message: err.message
      }
   });
  }