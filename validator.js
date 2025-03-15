const { body } = require("express-validator");

exports.loginValidator = [
  body("name", "Name cannot be empty")
    .not().isEmpty(),
  body("name", "Name must contain only letters")
    .isAlpha(),
  body("mobileNumber", "Mobile number cannot be empty")
    .not().isEmpty(),
  body("mobileNumber", "Mobile number must be 10 digits")
    .matches(/^\d{10}$/),
  body("email", "Email cannot be empty")
    .not().isEmpty(),
  body("email", "Email must be valid")
    .isEmail(),
  body("age", "Age must be a valid positive number")
    .isInt({ min: 1 }),
  body("password", "Password cannot be empty")
    .not().isEmpty(),
  body("password", "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  body("gender", "Gender cannot be empty")
    .not().isEmpty(),
  body("gender", "Gender must be one of 'male', 'female', or 'other'")
    .isIn(["male", "female", "other"]),
];