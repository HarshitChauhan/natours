module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';
    err.timeStamp = req.requestTime || new Date().toISOString();
  
    res.status(err.statusCode).json({
      status: err.status,
      timeStamp: err.timeStamp,
      errorDetails: {
          reason: err.reason, // need to take care of [error reason] later
          message: err.message
      }
   });
  }