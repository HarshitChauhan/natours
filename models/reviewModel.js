const mongoose = require('mongoose');
// const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// one tour should have only one review from one user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: 'name photo'
    });
    // this.populate({ 
    //     path: 'tour',
    //     select: 'name'
    //   }); // removing this populate so to prevent over population in result (tours>reviews>tour>guides...likewise)
  
    next();
  });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;