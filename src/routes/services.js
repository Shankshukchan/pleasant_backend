const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  getAdminServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/services');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { serviceCreateRules, serviceUpdateRules, idParam } = require('../validators');

router.route('/admin')
  .get(protect, authorize('admin'), getAdminServices)
  .post(protect, authorize('admin'), serviceCreateRules, validate, createService);

router.route('/admin/:id')
  .put(protect, authorize('admin'), serviceUpdateRules, validate, updateService)
  .delete(protect, authorize('admin'), idParam, validate, deleteService);

router.route('/')
  .get(getServices);

router.get('/:slug', getService);

module.exports = router;
