const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contact');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contactCreateRules } = require('../validators');

router.route('/')
  .get(protect, authorize('admin'), getContacts)
  .post(contactCreateRules, validate, submitContact);

module.exports = router;
