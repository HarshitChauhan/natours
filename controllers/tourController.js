const Tour = require('../models/tourModel');
const QueryFeatures = require('../utils/queryFeatures');

// middleware for top-five-tours alias
exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,ratingsAverage,duration,difficulty';
    next();
}

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
