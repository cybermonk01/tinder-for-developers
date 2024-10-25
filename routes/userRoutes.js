const express = require("express");
const {
  requests,
  feed,
  connections,
} = require("../controllers/userController.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/user/requests/received", auth, requests);
router.get("/user/connections", auth, connections);
router.get("/user/feed", auth, feed);

module.exports = router;
