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

module.exports = app;
