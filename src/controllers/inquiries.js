const Inquiry = require("../models/Inquiry");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create inquiry
// @route   POST /api/inquiries
exports.createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      serviceType: req.body.serviceType || "package",
    });

    res.status(201).json({
      success: true,
      message: "Inquiry received. We will get back to you within 30 mins.",
      data: inquiry,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, serviceType, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate("package", "title slug")
      .populate("destination", "name slug")
      .populate("service", "title slug")
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: inquiries.length,
      total,
      data: inquiries,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
exports.updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!inquiry) {
      return next(new ErrorResponse("Inquiry not found", 404));
    }

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete inquiry (admin)
// @route   DELETE /api/inquiries/:id
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return next(new ErrorResponse("Inquiry not found", 404));
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
