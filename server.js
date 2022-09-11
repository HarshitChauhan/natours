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

// Mongo Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is a required field!'] // <required: [status, 'error message']>
  },
  duration: Number, // if no other property to define, simply specify <fieldName: dataType>
  rating: {
    type: Number,
    default: 4.3
  },
  price: {
    type: Number,
    required: [true, 'Price is a required field!']
  },
})

const Tour = mongoose.model('Tour', tourSchema); // created a Tour out of this specified schema
 // creating instance of Tour object
const testTour = new Tour ( {
  name : 'The Forest',
  duration: 10,
  price : 497
})
 // saving tours to MongoDB
 testTour.save().then( doc => {
  console.log (doc)
 }).catch(err => {
   console.log('ERROR💥: ', err)
  })

// Starting Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App server running on port ${port}!`);
});
