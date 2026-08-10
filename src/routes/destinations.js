const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationsGrouped,
  getDestinationsList,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinations');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { destinationCreateRules, destinationUpdateRules, paginationRules } = require('../validators');

router.route('/')
  .get(paginationRules, validate, getDestinations)
  .post(protect, authorize('admin'), destinationCreateRules, validate, createDestination);

router.get('/list', getDestinationsList);
router.get('/grouped', getDestinationsGrouped);

router.route('/:slug')
  .get(getDestination)
  .put(protect, authorize('admin'), destinationUpdateRules, validate, updateDestination)
  .delete(protect, authorize('admin'), deleteDestination);

module.exports = router;
