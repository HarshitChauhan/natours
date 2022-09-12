const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(port, () => {
  console.log(`App server running on port ${port}!`);
});
