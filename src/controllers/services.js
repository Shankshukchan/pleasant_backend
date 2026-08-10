const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all active services (public)
// @route   GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { category, featured, search, limit = 50 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all services including inactive (admin)
// @route   GET /api/services/admin
exports.getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
// @route   GET /api/services/:slug
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return next(new ErrorResponse('Service not found', 404));
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Create service (admin)
// @route   POST /api/services
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service (admin)
// @route   PUT /api/services/:id
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) return next(new ErrorResponse('Service not found', 404));
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service (admin)
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return next(new ErrorResponse('Service not found', 404));
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
