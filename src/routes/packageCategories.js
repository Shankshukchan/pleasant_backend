const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  getCategoryPackages,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/packageCategories');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categoryCreateRules, categoryUpdateRules, idParam } = require('../validators');

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), categoryCreateRules, validate, createCategory);

router.get('/:slug/packages', getCategoryPackages);

router.route('/:slug')
  .get(getCategory);

router.route('/:id')
  .put(protect, authorize('admin'), categoryUpdateRules, validate, updateCategory)
  .delete(protect, authorize('admin'), idParam, validate, deleteCategory);

module.exports = router;
