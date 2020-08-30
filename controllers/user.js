const User = require("../models/user");

exports.userById = async (req, res, next, id) => {
  await User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User does not exists/Unable to find!",
      });
    }
    req.profile = user;
    next();
  });
};
