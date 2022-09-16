const express = require('express');

const router = express.Router();
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, topFiveTours } = require('../controllers/tourController');

// router.param('id', validateId);

// creating alias endpoint {using custom middleware}
router.route('/top-five-tours').get(topFiveTours, getAllTours);

router.route('/')
    .get(getAllTours)
    .post(createNewTour);
    
router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);
    
module.exports = router;