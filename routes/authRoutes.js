const express = require("express");

const {
  test,
  signUp,
  login,
  logout,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.get("/auth/test", test);
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

module.exports = router;
