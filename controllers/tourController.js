const Tour = require('../models/tourModel');

// Get All Tours
exports.getAllTours = async (req, res) => {
    try{
        // Building query
        const queryObj = {...req.query}; // creating shallow copy
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // excluding not required params
        excludedFields.forEach( el => delete queryObj[el]) ;
        const query = Tour.find(queryObj) ;

        // Executing query
        const tours = await query;
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
