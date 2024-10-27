const jwt = require("jsonwebtoken");
const User = require("../models/auth.model.js");

const auth = async (req, res, next) => {
  try {
    // const token = req.cookies;
    const { token } = req.cookies;
    console.log("token-auth", token, req);
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    const decodedObj = jwt.verify(token, "Secrets");

    const { _id } = decodedObj;

    const data = await User.findById(_id);

    if (!data) {
      throw new Error("User not found");
    }
    req.user = data;

    next();
  } catch (err) {
    console.log(err.message, "err");
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { auth };
