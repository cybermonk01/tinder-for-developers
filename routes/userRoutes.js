const express = require("express");
const { requests } = require("../controllers/userController.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/user/requests/received", auth, requests);

module.exports = router;
