const dotenv = require('dotenv');
const mongoose = require('mongoose');

// ErrorHandling: catching uncaught_exception(programming errors) before starting server
process.on('uncaughtException' , err => {
  console.log('UNCAUGHT_EXCEPTION: Shutting down the application...');
  console.error({
    status: '💥 ERROR 💥',
    timeStamp: new Date().toISOString(),
    errorDetails: {
      reason: err.name,
      message: err.message
    }
  });
  process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

// Connecting to MongoDB
const connectionString = process.env.DB_URL.replace('<username>', process.env.DB_USERNAME).replace('<password>', process.env.DB_PASSWORD);
// Creating connection
mongoose.connect(connectionString, {
  useNewUrlParser : true ,
  useCreateIndex : true ,
  useFindAndModify : false,
  useUnifiedTopology: true
}).then(() =>{
  console.log('DB Connected!');
});

// Starting Server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App server running on port ${port}!`);
});

// ErrorHandling: Outside errors of Node/Express, Unhandled Rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED_REJECTION: Shutting down the server...');
  console.error({
    status: '💥 ERROR 💥',
    timeStamp: new Date().toISOString(),
    errorDetails: {
      reason: err.name,
      message: err.message
    }
  });
  server.close(() => { //server.close() first closes the server then exists the process
    process.exit(1);
  });
});