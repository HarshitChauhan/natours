const Tour = require('../models/tourModel');
const QueryFeatures = require('../utils/queryFeatures');

// middleware for top-five-tours alias
exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,ratingsAverage,duration,difficulty';
    next();
}

// Aggregation pipeline - Matching and Grouping
exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
        ]);
    
        res.status(200).json({
        status: 'success',
        data: {
            stats
        }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
  };

  // Aggregation pipeline - Unwind and Project
  exports.getMonthlyPlan = async (req, res) => {
    try{
    const year = req.params.year * 1;
  
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan
      }
    });

    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
  };

// Get All Tours
exports.getAllTours = async (req, res) => {
    try{
        const features = new QueryFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
};

// Get Tour by ID
exports.getTourById = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
};

// Update Tour details by ID
exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
};

// Delete Tour by ID
exports.deleteTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        // console.log(tour);
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:NOT_FOUND",
                message: err
            }
        })
    }
};

// Create a new Tour
exports.createNewTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'failed',
            timeStamp: req.requestTime,
            errorDetails: {
                reason: "API:BAD_REQUEST",
                message: err
            }
        })
    }
    
};
