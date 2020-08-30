const express = require("express");
const router = express.Router();
const {
  sayHi,
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");
const { signUpValidator, result } = require("../validator/index");

router.get("/", requireSignin, (req, res) => {
  res.json({ message: "Hi from contrlr side" });
});

router.post("/signup", signUpValidator, result, signup);

router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
