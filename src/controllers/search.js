const Package = require('../models/Package');
const Destination = require('../models/Destination');
const Stay = require('../models/Stay');
const Blog = require('../models/Blog');

// @desc    Search across all content
// @route   GET /api/search
exports.search = async (req, res, next) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, error: 'Please provide a search term' });
    }

    const regex = new RegExp(q, 'i');
    const results = {};

    if (!type || type === 'packages') {
      results.packages = await Package.find({
        $or: [{ title: regex }, { description: regex }],
        isActive: true
      }).populate('destination', 'name slug image').limit(10);
    }

    if (!type || type === 'destinations') {
      results.destinations = await Destination.find({
        $or: [{ name: regex }, { state: regex }, { description: regex }],
        isActive: true
      }).limit(10);
    }

    if (!type || type === 'stays') {
      results.stays = await Stay.find({
        $or: [{ name: regex }, { state: regex }, { city: regex }],
        isActive: true
      }).populate('destination', 'name slug').limit(10);
    }

    if (!type || type === 'blogs') {
      results.blogs = await Blog.find({
        $or: [{ title: regex }, { content: regex }],
        isPublished: true
      }).limit(10);
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
