const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews
// @route   GET /api/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const { package: pkgId, destination: destId, stay: stayId, limit = 50, admin } = req.query;
    const query = {};

    if (admin !== 'true') {
      query.isApproved = true;
    }

    if (pkgId) query.package = pkgId;
    if (destId) query.destination = destId;
    if (stayId) query.stay = stayId;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { email, package: pkgId, destination: destId, stay: stayId } = req.body;

    const existing = await Review.findOne({
      email,
      $or: [
        ...(pkgId ? [{ package: pkgId }] : []),
        ...(destId ? [{ destination: destId }] : []),
        ...(stayId ? [{ stay: stayId }] : []),
      ],
    });

    if (existing) {
      return next(new ErrorResponse('You have already submitted a review for this item', 400));
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve review (admin)
// @route   PUT /api/reviews/:id/approve
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return next(new ErrorResponse('Review not found', 404));
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return next(new ErrorResponse('Review not found', 404));
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};