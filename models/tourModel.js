const mongoose = require('mongoose');
const slugify = require('slugify');

// Mongo Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain caracters']
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficulty !'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
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
      validate: {
        validator: function(value) {
          return value < this.price; // 'this' only points to current doc on NEW documnet creation
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
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
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON Data Type for GeoLocation in Mongo
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId, // referencing model
        ref: 'User'
      }
    ]
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

  // Virtual populate (showing in the results without storing in db)
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // field name in Review collection
  localField: '_id' // ref to which field in Tour collection
});

    // DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
  tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  
  // QUERY MIDDLEWARE: runs for query methods .find() and .findOne() etc
  tourSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides', // populating guides details referencing ids 
      select: '-__v -passwordChangedAt' // removing these fields from result output
    });
    next();
  });

  // tourSchema.pre('find', function(next) {
  tourSchema.pre(/^find/, function(next) { // using regex for methods starting from 'find', like find, findOneandUpdate etc 
    this.find({ secretTour: { $ne: true } }); // removing all the documents from the output which have secretTour set to true
    next();
  });

  // AGGREGATION MIDDLEWARE
  tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // removing all the documents from the stats and monthly-plan output which have secretTour set to true
    next();
  });

  const Tour = mongoose.model('Tour', tourSchema); // created a Tour out of this specified schema

  module.exports = Tour;