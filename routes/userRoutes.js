const express = require("express");
const {
  requests,
  feed,
  connections,
  editProfile,
} = require("../controllers/userController.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/user/requests/received", auth, requests);
router.get("/user/connections", auth, connections);
router.post("/user/feed", auth, feed);
router.patch("/user/edit", auth, editProfile);

module.exports = router;
