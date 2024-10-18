const express = require("express");
const { auth } = require("../middleware/auth.js");

const {
  sendRequest,
  reviewRequest,
} = require("../controllers/connectionController.js");
const router = express.Router();

router.post("/request/send/:status/:userId", auth, sendRequest);
router.post("/request/review/:status/:requestId", auth, reviewRequest);

module.exports = router;
