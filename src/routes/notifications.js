const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const [newInquiries, pendingReviews, newContacts] = await Promise.all([
      Inquiry.countDocuments({ status: 'new' }),
      Review.countDocuments({ isApproved: false }),
      Contact.countDocuments({ status: 'new' }),
    ]);

    const total = newInquiries + pendingReviews + newContacts;

    res.json({
      success: true,
      data: {
        newInquiries,
        pendingReviews,
        newContacts,
        total,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
