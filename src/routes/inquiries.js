const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiries');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { inquiryCreateRules, inquiryUpdateRules, idParam, paginationRules } = require('../validators');

router.route('/')
  .get(protect, authorize('admin'), paginationRules, validate, getInquiries)
  .post(inquiryCreateRules, validate, createInquiry);

router.route('/:id')
  .put(protect, authorize('admin'), inquiryUpdateRules, validate, updateInquiry)
  .delete(protect, authorize('admin'), idParam, validate, deleteInquiry);

module.exports = router;
