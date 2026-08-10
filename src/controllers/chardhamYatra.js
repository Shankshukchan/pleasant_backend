const mongoose = require('mongoose');
const ChardhamYatra = require('../models/ChardhamYatra');
const ErrorResponse = require('../utils/errorResponse');

exports.getChardhamYatras = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const yatras = await ChardhamYatra.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, count: yatras.length, data: yatras });
  } catch (err) {
    next(err);
  }
};

exports.getChardhamYatra = async (req, res, next) => {
  try {
    const yatra = await ChardhamYatra.findOne({ slug: req.params.slug, isActive: true });
    if (!yatra) {
      return next(new ErrorResponse('Yatra not found', 404));
    }
    res.json({ success: true, data: yatra });
  } catch (err) {
    next(err);
  }
};

exports.createChardhamYatra = async (req, res, next) => {
  try {
    const yatra = await ChardhamYatra.create(req.body);
    res.status(201).json({ success: true, data: yatra });
  } catch (err) {
    next(err);
  }
};

exports.updateChardhamYatra = async (req, res, next) => {
  try {
    const param = req.params.slug || req.params.id;
    const filter = mongoose.Types.ObjectId.isValid(param) ? { _id: param } : { slug: param };
    const yatra = await ChardhamYatra.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (!yatra) {
      return next(new ErrorResponse('Yatra not found', 404));
    }
    res.json({ success: true, data: yatra });
  } catch (err) {
    next(err);
  }
};

exports.deleteChardhamYatra = async (req, res, next) => {
  try {
    const param = req.params.slug || req.params.id;
    const filter = mongoose.Types.ObjectId.isValid(param) ? { _id: param } : { slug: param };
    const yatra = await ChardhamYatra.findOneAndDelete(filter);
    if (!yatra) {
      return next(new ErrorResponse('Yatra not found', 404));
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getAdminChardhamYatras = async (req, res, next) => {
  try {
    const yatras = await ChardhamYatra.find().sort({ createdAt: -1 });
    res.json({ success: true, count: yatras.length, data: yatras });
  } catch (err) {
    next(err);
  }
};