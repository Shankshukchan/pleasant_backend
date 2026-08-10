const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const State = require('../models/State');
const ErrorResponse = require('../utils/errorResponse');

const mongoose__isObjectId = (val) => mongoose.Types.ObjectId.isValid(val);

// @desc    Get all destinations
// @route   GET /api/destinations
exports.getDestinations = async (req, res, next) => {
  try {
    const { region, featured, limit = 50 } = req.query;
    const query = { isActive: true };

    if (region) query.region = region;
    if (featured) query.isFeatured = true;

    const destinations = await Destination.find(query)
      .sort({ order: 1, name: 1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get destinations list (simplified, for admin dropdowns)
// @route   GET /api/destinations/list
exports.getDestinationsList = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ isActive: true })
      .select('name slug state')
      .sort({ name: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get destinations grouped by state
// @route   GET /api/destinations/grouped
exports.getDestinationsGrouped = async (req, res, next) => {
  try {
    const { search } = req.query;
    const states = await State.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    const destQuery = { isActive: true };
    if (search) {
      destQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    const destinations = await Destination.find(destQuery).sort({ order: 1, name: 1 });

    const byState = {};
    destinations.forEach((d) => {
      const key = d.state || 'Other';
      if (!byState[key]) byState[key] = [];
      byState[key].push(d);
    });

    const grouped = states
      .map((s) => ({
        state: { _id: s._id, name: s.name, slug: s.slug, image: s.image, region: s.region },
        destinations: byState[s.name] || []
      }))
      .filter((g) => g.destinations.length > 0);

    // states without destinations
    Object.keys(byState).forEach((key) => {
      if (!states.find((s) => s.name === key)) {
        grouped.push({
          state: { _id: null, name: key, slug: '', image: '', region: '' },
          destinations: byState[key]
        });
      }
    });

    res.json({ success: true, count: destinations.length, data: grouped });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:slug
exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });

    if (!destination) {
      return next(new ErrorResponse('Destination not found', 404));
    }

    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

// @desc    Create destination
// @route   POST /api/destinations
exports.createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:slug
exports.updateDestination = async (req, res, next) => {
  try {
    const param = req.params.slug;
    const filter = mongoose__isObjectId(param) ? { _id: param } : { slug: param };
    const destination = await Destination.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    if (!destination) {
      return next(new ErrorResponse('Destination not found', 404));
    }

    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:slug
exports.deleteDestination = async (req, res, next) => {
  try {
    const param = req.params.slug;
    const filter = mongoose__isObjectId(param) ? { _id: param } : { slug: param };
    const destination = await Destination.findOneAndDelete(filter);

    if (!destination) {
      return next(new ErrorResponse('Destination not found', 404));
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
