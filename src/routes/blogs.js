const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogs');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { blogCreateRules, blogUpdateRules, idParam, paginationRules } = require('../validators');

router.route('/')
  .get(paginationRules, validate, getBlogs)
  .post(protect, authorize('admin'), blogCreateRules, validate, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, authorize('admin'), blogUpdateRules, validate, updateBlog)
  .delete(protect, authorize('admin'), idParam, validate, deleteBlog);

module.exports = router;
