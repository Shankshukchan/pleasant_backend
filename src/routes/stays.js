const express = require('express');
const router = express.Router();
const {
  getStays,
  getStay,
  createStay,
  updateStay,
  deleteStay
} = require('../controllers/stays');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { stayCreateRules, stayUpdateRules, idParam, paginationRules } = require('../validators');

router.route('/')
  .get(paginationRules, validate, getStays)
  .post(protect, authorize('admin'), stayCreateRules, validate, createStay);

router.route('/:slug')
  .get(getStay);

router.route('/:id')
  .put(protect, authorize('admin'), stayUpdateRules, validate, updateStay)
  .delete(protect, authorize('admin'), idParam, validate, deleteStay);

module.exports = router;
