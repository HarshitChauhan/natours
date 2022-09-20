const mongoose = require('mongoose');

// Mongo Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      // trim: true,
      // maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      // minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain caracters']
    },
    // slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum: {
      //   values: ['easy', 'medium', 'difficult'],
      //   message: 'Difficulty is either: easy, medium, difficulty'
      // }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // min: [1, 'Rating must be above 1.0'],
      // max: [5, 'Rating must be below 5.0'],
      // set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function(value) {
      //     // this only points to current doc on NEW documnet creation
      //     return value < this.price;
      //   },
        // message: 'Discount price ({VALUE}) should be below regular price'
      // }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
  //   secretTour: {
  //     type: Boolean,
  //     default: false
  //   },
  //   startLocation: {
  //     // GeoJSON
  //     type: {
  //       type: String,
  //       default: 'Point',
  //       enum: ['Point']
  //     },
  //     coordinates: [Number],
  //     address: String,
  //     description: String
  //   },
  //   locations: [
  //     {
  //       type: {
  //         type: String,
  //         default: 'Point',
  //         enum: ['Point']
  //       },
  //       coordinates: [Number],
  //       address: String,
  //       description: String,
  //       day: Number
  //     }
  //   ],
  //   guides: [
  //     {
  //       type: mongoose.Schema.ObjectId,
  //       ref: 'User'
  //     }
  //   ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
  
  // virtual properties is not actual data that present on db, it is calculated after fetching db data 
  tourSchema.virtual('durationWeeks').get( function () {
    return this.duration / 7;
  })
  const Tour = mongoose.model('Tour', tourSchema); // created a Tour out of this specified schema

  module.exports = Tour;