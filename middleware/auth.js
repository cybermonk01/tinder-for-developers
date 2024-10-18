const jwt = require("jsonwebtoken");
const User = require("../models/auth.model.js");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log("token", token);
    const decodedObj = jwt.verify(token.token, "Secret");

    const { _id } = decodedObj;

    const data = await User.findById(_id);

    if (!data) {
      throw new Error("User not found");
    }
    req.user = data;

    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { auth };
