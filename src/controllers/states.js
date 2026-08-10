const State = require('../models/State');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all states
// @route   GET /api/states
exports.getStates = async (req, res, next) => {
  try {
    const { region, limit = 50 } = req.query;
    const query = { isActive: true };
    if (region) query.region = region;

    const states = await State.find(query).sort({ order: 1, name: 1 }).limit(parseInt(limit));
    res.json({ success: true, count: states.length, data: states });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single state
// @route   GET /api/states/:slug
exports.getState = async (req, res, next) => {
  try {
    const state = await State.findOne({ slug: req.params.slug, isActive: true });
    if (!state) return next(new ErrorResponse('State not found', 404));
    res.json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
};

// @desc    Create state
// @route   POST /api/states
exports.createState = async (req, res, next) => {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
};

// @desc    Update state
// @route   PUT /api/states/:id
exports.updateState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!state) return next(new ErrorResponse('State not found', 404));
    res.json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete state
// @route   DELETE /api/states/:id
exports.deleteState = async (req, res, next) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return next(new ErrorResponse('State not found', 404));
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
