const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppErrorHandler = require('./utils/appErrorHandler');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//{----Global Middleware----}
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev')); //Morgan is a logger
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // max 100 requests
  windowMs: 60 * 60 * 1000, // per hour is allowed
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // for all routes starting from '/api'

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

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
  // using custom class appErrorHandler //
  next(new AppErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));

  // using Global Error Handler //
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'failed';
  // err.statusCode = 404;
  // err.reason = "ROUTE:NOT_FOUND";
  // err.timeStamp = req.requestTime;

  // next(err);
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
