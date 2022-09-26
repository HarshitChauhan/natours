const express = require('express');
const { protect } = require('../controllers/authController');

const router = express.Router();
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, topFiveTours, getTourStats, getMonthlyPlan } = require('../controllers/tourController');

// router.param('id', validateId);

// creating alias endpoint {using custom middleware}
router.route('/top-five-tours').get(topFiveTours, getAllTours);

// tourStats through Aggregation pipeline
router.route('/tour-stats').get(getTourStats);

// tours Monthly Plan by [Year] through Aggregation pipeline
router.route('/tour-monthly-plan/:year').get(getMonthlyPlan);

router.route('/')
    .get(protect ,getAllTours)
    .post(createNewTour);
    
router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);
    
module.exports = router;