const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: check if request has valid admin token
const isAdminRequest = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id).select('role');
    return user && user.role === 'admin';
  } catch {
    return false;
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, tag, destination, page = 1, limit = 10 } = req.query;
    const admin = await isAdminRequest(req);
    const query = admin ? {} : { isPublished: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (destination) query.destination = destination;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .populate('destination', 'name slug')
      .sort({ publishedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
exports.getBlog = async (req, res, next) => {
  try {
    const param = req.params.id;
    const isObjectId = require('mongoose').Types.ObjectId.isValid(param);
    const filter = isObjectId ? { _id: param, isPublished: true } : { slug: param, isPublished: true };
    const blog = await Blog.findOne(filter)
      .populate('author', 'name')
      .populate('destination', 'name slug');

    if (!blog) {
      return next(new ErrorResponse('Blog not found', 404));
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return next(new ErrorResponse('Blog not found', 404));
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return next(new ErrorResponse('Blog not found', 404));
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
