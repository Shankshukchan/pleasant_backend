const express = require('express');
const router = express.Router();
const {
  getStates,
  getState,
  createState,
  updateState,
  deleteState
} = require('../controllers/states');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { stateCreateRules, stateUpdateRules, idParam, paginationRules } = require('../validators');

router.route('/')
  .get(paginationRules, validate, getStates)
  .post(protect, authorize('admin'), stateCreateRules, validate, createState);

router.route('/:slug')
  .get(getState);

router.route('/:id')
  .put(protect, authorize('admin'), stateUpdateRules, validate, updateState)
  .delete(protect, authorize('admin'), idParam, validate, deleteState);

module.exports = router;
