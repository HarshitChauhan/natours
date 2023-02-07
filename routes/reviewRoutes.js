const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  setTourUserIds,
  getReviewById,
  updateReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// to Protect all the below routes, using one router middleware trick instead of passing to each route
router.use(protect); 

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReviewById)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;
