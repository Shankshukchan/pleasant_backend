const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  approveReview,
  deleteReview
} = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewCreateRules, idParam } = require('../validators');

router.route('/')
  .get(getReviews)
  .post(reviewCreateRules, validate, createReview);

router.route('/:id/approve')
  .put(protect, authorize('admin'), idParam, validate, approveReview);

router.route('/:id')
  .delete(protect, authorize('admin'), idParam, validate, deleteReview);

module.exports = router;
