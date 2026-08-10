const PackageCategory = require('../models/PackageCategory');
const Package = require('../models/Package');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories (public)
// @route   GET /api/package-categories
exports.getCategories = async (req, res, next) => {
  try {
    const { includeInactive, sort } = req.query;
    const query = includeInactive ? {} : { isActive: true };
    const sortOption = sort || '-createdAt';

    const categories = await PackageCategory.find(query).sort(sortOption);
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category by slug (public)
// @route   GET /api/package-categories/:slug
exports.getCategory = async (req, res, next) => {
  try {
    const category = await PackageCategory.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return next(new ErrorResponse('Category not found', 404));
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Get packages by category slug
// @route   GET /api/package-categories/:slug/packages
exports.getCategoryPackages = async (req, res, next) => {
  try {
    const category = await PackageCategory.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return next(new ErrorResponse('Category not found', 404));

    const { sort = '-popular', page = 1, limit = 12, minPrice, maxPrice, minDays, maxDays, state } = req.query;

    const query = { categories: category._id, isActive: true };

    if (state) query.state = state;
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
      .populate('categories', 'name slug')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      category,
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

// @desc    Create category (admin)
// @route   POST /api/package-categories
exports.createCategory = async (req, res, next) => {
  try {
    const category = await PackageCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category (admin)
// @route   PUT /api/package-categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await PackageCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return next(new ErrorResponse('Category not found', 404));
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category (admin)
// @route   DELETE /api/package-categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await PackageCategory.findByIdAndDelete(req.params.id);
    if (!category) return next(new ErrorResponse('Category not found', 404));

    // Remove category reference from all packages
    await Package.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
