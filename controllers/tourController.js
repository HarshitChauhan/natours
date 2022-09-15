const { Error } = require('mongoose');
const Tour = require('../models/tourModel');

// Get All Tours
exports.getAllTours = async (req, res) => {
    try{
        // Building query
        const queryObj = {...req.query}; // creating shallow copy
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // excluding not required params
        excludedFields.forEach( el => delete queryObj[el]) ;

        // creating comparison filterations [gte|gt|lte|lt]
        let queryStr = JSON.stringify (queryObj) ;
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
                                                             
        let query = Tour.find(JSON.parse(queryStr)) ;

        // Sorting
        if(req.query.sort){
            const sortByQuery = req.query.sort.split(',').join(' '); // can have one or more sprting params
            query = query.sort(sortByQuery); // [price, ratingsAverage] | [-price, -ratingsAverage] 
            // (plu-minus for asc-desc order)  
        } else {
            query = query.sort('-createdAt'); // default sort param
        }

        // Field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' '); // include fields to show as results 
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // removing mongodb '__v' field by default
        }

        // Implementing Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        
        if(req.query.page){
        const numOfTours = await Tour.countDocuments();
        if (skip >= numOfTours) throw new Error('This page does not exist!');
        }

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
