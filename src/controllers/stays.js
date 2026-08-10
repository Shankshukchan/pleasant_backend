const Stay = require('../models/Stay');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get stays (filterable by destination / state / type / search)
// @route   GET /api/stays
exports.getStays = async (req, res, next) => {
  try {
    const { destination, state, type, featured, search, limit = 20 } = req.query;
    const query = { isActive: true };
    if (destination) query.destination = destination;
    if (state) query.state = state;
    if (type) query.type = type;
    if (featured) query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const stays = await Stay.find(query)
      .populate('destination', 'name slug')
      .sort({ order: 1, rating: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: stays.length, data: stays });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single stay
// @route   GET /api/stays/:slug
exports.getStay = async (req, res, next) => {
  try {
    const stay = await Stay.findOne({ slug: req.params.slug, isActive: true }).populate('destination', 'name slug');
    if (!stay) return next(new ErrorResponse('Stay not found', 404));
    res.json({ success: true, data: stay });
  } catch (err) {
    next(err);
  }
};

// @desc    Create stay
// @route   POST /api/stays
exports.createStay = async (req, res, next) => {
  try {
    const stay = await Stay.create(req.body);
    res.status(201).json({ success: true, data: stay });
  } catch (err) {
    next(err);
  }
};

// @desc    Update stay
// @route   PUT /api/stays/:id
exports.updateStay = async (req, res, next) => {
  try {
    const stay = await Stay.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stay) return next(new ErrorResponse('Stay not found', 404));
    res.json({ success: true, data: stay });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete stay
// @route   DELETE /api/stays/:id
exports.deleteStay = async (req, res, next) => {
  try {
    const stay = await Stay.findByIdAndDelete(req.params.id);
    if (!stay) return next(new ErrorResponse('Stay not found', 404));
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
