const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRoutes");

const router = express.Router();
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, topFiveTours, getTourStats, getMonthlyPlan, getToursWithin } = require('../controllers/tourController');

router.use('/:tourId/reviews', reviewRouter);

// creating alias endpoint {using custom middleware}
router.route('/top-five-tours').get(topFiveTours, getAllTours);

// tourStats through Aggregation pipeline
router.route('/tour-stats').get(getTourStats);

// tours Monthly Plan by [Year] through Aggregation pipeline
router.route('/tour-monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// tours within range distance // eg., tour within 50 from center as delhi in unit kms or mi
// tour-within/50/center/-25,30/unit/km
router.route('/tour-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router.use(protect);

router.route('/')
    .get(getAllTours)
    .post(restrictTo('admin', 'lead-guide'), createNewTour);
    
router.route('/:id')
    .get(getTourById)
    .patch(restrictTo('admin', 'lead-guide'), updateTour)
    .delete(restrictTo('admin', 'lead-guide'), deleteTour);
    
module.exports = router;