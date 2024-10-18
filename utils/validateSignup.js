const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!(firstName || lastName)) {
    throw new Error("fname or lName both are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email id should be proper");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("not enough strong password");
  }
};

module.exports = { validateSignUp };
