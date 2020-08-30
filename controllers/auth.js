const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandlers");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.sayHi = (req, res) => {
  res.json({ message: "Hi from contrlr side" });
};

exports.signup = async (req, res) => {
  const user = new User(req.body);
  await user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hash_password = undefined;
    res.json(user);
  });
};

exports.signout = async (req, res) => {
  const user = new User(req.body);
  await res.clearCookie("t");
  return res.json({ message: "Signout successful" });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "Invalid email! User does not exists!",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: "Incorrect email or password!",
      });
    }

    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = async (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({ error: "Access denied!" });
  }

  await next();
};

exports.isAdmin = async (req, res, next) => {
  let user = req.profile.role === 0;
  if (!user) {
    return res.status(403).json({ error: "Admin resource, access denied!" });
  }

  await next();
};
