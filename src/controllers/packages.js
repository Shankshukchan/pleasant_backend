const Package = require('../models/Package');
const PackageCategory = require('../models/PackageCategory');
const ErrorResponse = require('../utils/errorResponse');

async function updateCategoryCounts(categoryIds) {
  for (const catId of categoryIds) {
    const count = await Package.countDocuments({ categories: catId, isActive: true });
    await PackageCategory.findByIdAndUpdate(catId, { $set: { packageCount: count } });
  }
}

// @desc    Get all packages
// @route   GET /api/packages
exports.getPackages = async (req, res, next) => {
  try {
    const {
      destination, category, minPrice, maxPrice,
      minDays, maxDays, state, sort = '-createdAt',
      page = 1, limit = 12, featured, popular
    } = req.query;

    const query = { isActive: true };

    if (destination) query.destination = destination;
    if (state) query.state = state;
    if (category) query.categories = { $in: category.split(',') };
    if (featured) query.featured = true;
    if (popular) query.popular = true;

    if (minPrice || maxPrice) {
      query['price.discounted'] = {};
      if (minPrice) query['price.discounted'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.discounted'].$lte = parseInt(maxPrice);
    }

    if (minDays || maxDays) {
      query['duration.days'] = {};
      if (minDays) query['duration.days'].$gte = parseInt(minDays);
      if (maxDays) query['duration.days'].$lte = parseInt(maxDays);
    }

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name slug image')
      .populate('categories', 'name slug image')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: packages.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single package
// @route   GET /api/packages/:slug
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true })
      .populate('destination', 'name slug image state region')
      .populate('categories', 'name slug image');

    if (!pkg) {
      return next(new ErrorResponse('Package not found', 404));
    }

    // Get related packages
    const related = await Package.find({
      destination: pkg.destination._id,
      _id: { $ne: pkg._id },
      isActive: true
    }).limit(4).populate('destination', 'name slug image').populate('categories', 'name slug');

    res.json({ success: true, data: pkg, related });
  } catch (err) {
    next(err);
  }
};

// @desc    Get packages by destination slug
// @route   GET /api/packages/destination/:destSlug
exports.getPackagesByDestination = async (req, res, next) => {
  try {
    const Destination = require('../models/Destination');
    const dest = await Destination.findOne({ slug: req.params.destSlug });

    if (!dest) {
      return next(new ErrorResponse('Destination not found', 404));
    }

    const { sort = '-popular', page = 1, limit = 12, minPrice, maxPrice, minDays, maxDays, state } = req.query;

    const query = { destination: dest._id, isActive: true };

    if (minPrice || maxPrice) {
      query['price.discounted'] = {};
      if (minPrice) query['price.discounted'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.discounted'].$lte = parseInt(maxPrice);
    }
    if (minDays || maxDays) {
      query['duration.days'] = {};
      if (minDays) query['duration.days'].$gte = parseInt(minDays);
      if (maxDays) query['duration.days'].$lte = parseInt(maxDays);
    }

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name slug image')
      .populate('categories', 'name slug image')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      destination: dest,
      count: packages.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create package
// @route   POST /api/packages
exports.createPackage = async (req, res, next) => {
  try {
    const Destination = require('../models/Destination');

    console.log('[createPackage] body.destination:', JSON.stringify(req.body.destination));
    console.log('[createPackage] body.isActive:', req.body.isActive);

    if (req.body.destination && !req.body.state) {
      const dest = await Destination.findById(req.body.destination);
      if (dest) {
        req.body.state = dest.state;
        console.log('[createPackage] auto-filled state:', dest.state);
      } else {
        console.log('[createPackage] destination NOT FOUND by id:', req.body.destination);
      }
    }

    const pkg = await Package.create(req.body);
    console.log('[createPackage] created pkg._id:', pkg._id, 'pkg.destination:', pkg.destination, 'pkg.isActive:', pkg.isActive);

    const destId = pkg.destination || req.body.destination;
    const isActive = pkg.isActive !== undefined ? pkg.isActive : true;
    console.log('[createPackage] destId:', destId, 'isActive:', isActive);

    if (destId) {
      const count = await Package.countDocuments({ destination: destId, isActive: true });
      const result = await Destination.findByIdAndUpdate(destId, { $set: { packageCount: count } }, { new: true });
      if (result) {
        console.log('[createPackage] packageCount set to:', result.packageCount, 'for dest:', result.name);
      } else {
        console.log('[createPackage] Destination NOT FOUND for $set with id:', destId);
      }
    } else {
      console.log('[createPackage] SKIPPED count update - no destId');
    }

    if (pkg.categories && pkg.categories.length > 0) {
      await updateCategoryCounts(pkg.categories);
    }

    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    console.error('[createPackage] ERROR:', err.message);
    next(err);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const Destination = require('../models/Destination');
    const existing = await Package.findById(req.params.id);
    if (!existing) return next(new ErrorResponse('Package not found', 404));

    if (req.body.destination && !req.body.state) {
      const dest = await Destination.findById(req.body.destination);
      if (dest) req.body.state = dest.state;
    }

    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    const destIds = new Set();
    if (existing.destination) destIds.add(existing.destination.toString());
    if (pkg.destination) destIds.add(pkg.destination.toString());

    for (const id of destIds) {
      const count = await Package.countDocuments({ destination: id, isActive: true });
      await Destination.findByIdAndUpdate(id, { $set: { packageCount: count } });
    }

    const catIds = new Set();
    if (existing.categories) existing.categories.forEach(c => catIds.add(c.toString()));
    if (pkg.categories) pkg.categories.forEach(c => catIds.add(c.toString()));
    if (catIds.size > 0) {
      await updateCategoryCounts([...catIds]);
    }

    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};



// @desc    Delete package
// @route   DELETE /api/packages/:id
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);

    if (!pkg) {
      return next(new ErrorResponse('Package not found', 404));
    }

    if (pkg.destination) {
      const Destination = require('../models/Destination');
      const count = await Package.countDocuments({ destination: pkg.destination, isActive: true });
      await Destination.findByIdAndUpdate(pkg.destination, { $set: { packageCount: count } });
    }

    if (pkg.categories && pkg.categories.length > 0) {
      await updateCategoryCounts(pkg.categories);
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
