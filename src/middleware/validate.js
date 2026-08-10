const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  result.array().forEach((e) => {
    const key = e.path || e.param || '_';
    if (!errors[key]) errors[key] = e.msg;
  });

  return res.status(400).json({
    success: false,
    error: Object.values(errors)[0],
    errors,
  });
};

module.exports = validate;
