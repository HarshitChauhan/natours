const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRoutes");

const router = express.Router();
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, topFiveTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController');

router.use('/:tourId/reviews', reviewRouter);

// creating alias endpoint {using custom middleware}
router.route('/top-five-tours').get(topFiveTours, getAllTours);

// tourStats through Aggregation pipeline
router.route('/tour-stats').get(getTourStats);

// tours Monthly Plan by [Year] through Aggregation pipeline
router.route('/tour-monthly-plan/:year').get(getMonthlyPlan);

router.route('/')
    .get(protect ,getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createNewTour);
    
router.route('/:id')
    .get(protect, getTourById)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
    
module.exports = router;