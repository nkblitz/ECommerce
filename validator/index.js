const { validationResult, check } = require("express-validator");

const signUpValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email")
    .isEmail()
    .withMessage(
      "Email must be in right format and in between 3 and 32 characters"
    ),
  check("password")
    .exists()
    .withMessage("Password should not be empty")
    .isLength({ min: 6 })
    .withMessage("Password needs at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must has at least one number"),
];

const productValidator = [
  check("name").trim().not().isEmpty().withMessage("Product name is required"),
  check("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Product name is required"),
  check("price")
    .isNumeric()
    .withMessage("Price has to be a numeric value and is missing"),
  check("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Category name is required"),
  check("shipping")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Shipping value is required"),
];

const result = (req, res, next) => {
  const result = validationResult(req);
  const hasError = !result.isEmpty();

  if (hasError) {
    console.log("***************************");
    console.log("result", result.array());
    console.log("result length", result.array().length);
    const error = result.array()[0].msg;
    console.log("error", error);
    //res.status(400);
    // next(error);
    return res.status(400).json({ error });
  }
  next();
};

module.exports = {
  signUpValidator,
  productValidator,
  result,
};
