const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 3rd party Middleware
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev')); //Morgan is a logger
}

app.use(express.json());

// to serve static files in express
app.use(express.static(`${__dirname}/public`));

// custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Error Handling: Route not found
app.all ('*', (req, res, next) => {
  // custom handler //
//   res.status(404).json({
//     status: 'failed',
//     timeStamp: req.requestTime,
//     errorDetails: {
//         reason: "ROUTE:NOT_FOUND",
//         message: `Can't find ${req.originalUrl} on this server !`
//     }
//  });

  // using Global Error Handler //
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'failed';
  err.statusCode = 404;
  err.reason = "ROUTE:NOT_FOUND";
  err.timeStamp = req.requestTime;

  next(err);
});

// Global Error Handler
app.use((err, req, res, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'failed';

  res.status(err.statusCode).json({
    status: err.status,
    timeStamp: err.timeStamp,
    errorDetails: {
        reason: err.reason,
        message: err.message
    }
 });
})

module.exports = app;
