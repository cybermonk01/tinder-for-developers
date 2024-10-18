const apiError = require("../utils/apiError");
const User = require("../models/auth.model.js");
const bcrypt = require("bcryptjs");
const { validateSignUp } = require("../utils/validateSignup");

const test = (req, res) => {
  return res.send("test 1");
};

const signUp = async (req, res) => {
  validateSignUp(req);
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    skills,
    photoUrl,
    about,
  } = req.body;
  if (!(firstName || emailId)) {
    return apiError("Fname and emailId required");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    age,
    gender,
    skills,
    photoUrl,
    about,
  });

  const data = await user.save();
  const token = await user.getJWT();

  res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
  });

  return res.status(201).json({
    message: "user created successful",
    data,
  });
};

const login = async (req, res) => {
  const { emailId, password } = req.body;

  if (!(emailId || password)) {
    throw new Error("both fields are required!");
  }

  const user = await User.findOne({ emailId });

  if (!user) {
    throw new Error("user not exist");
  }

  const isPasswordMatched = await user.validatePassword(password);

  if (isPasswordMatched) {
    const token = await user.getJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
  }

  res.status(200).json({
    message: "login successful",
    user,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "logout successful",
  });
};
module.exports = {
  test,
  signUp,
  login,
  logout,
};
