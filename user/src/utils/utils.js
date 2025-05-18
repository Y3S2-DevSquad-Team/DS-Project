const { validationResult } = require("express-validator");
const { ValidationFailureError } = require("./ErrorHandling/CustomErrors");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => `${err.param}: ${err.msg}`);
    return next(new ValidationFailureError(`Invalid value(s): ${formatted.join(", ")}`)); // ✅ proper error throwing
  }
  next(); // ✅ continue if no errors
};
