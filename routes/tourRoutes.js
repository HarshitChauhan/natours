const express = require('express');
const router = express.Router();
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, validateId } = require('../controllers/tourController'); 

router.param('id', validateId);

router.route('/')
    .get(getAllTours)
    .post(createNewTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;