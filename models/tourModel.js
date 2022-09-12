const mongoose = require('mongoose');

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

  module.exports = Tour;