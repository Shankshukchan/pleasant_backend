const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackage,
  getPackagesByDestination,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packages');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { packageCreateRules, packageUpdateRules, idParam, paginationRules } = require('../validators');

router.route('/')
  .get(paginationRules, validate, getPackages)
  .post(protect, authorize('admin'), packageCreateRules, validate, createPackage);

router.get('/destination/:destSlug', getPackagesByDestination);

router.route('/:slug')
  .get(getPackage);

router.route('/:id')
  .put(protect, authorize('admin'), packageUpdateRules, validate, updatePackage)
  .delete(protect, authorize('admin'), idParam, validate, deletePackage);

module.exports = router;
