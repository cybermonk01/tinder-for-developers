const { Schema, default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: [3, "Too few chars"],
    },
    lastName: {
      type: String,
      required: true,
      min: [3, "Too few chars"],
    },
    emailId: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email invalid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password not strong" + value);
        }
      },
    },

    age: Number,
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },

    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Secret", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.pre("save", async function () {});

userSchema.methods.validatePassword = async function (password) {
  const user = this;

  const passwordHash = user.password;

  const isPasswordMatched = await bcrypt.compare(password, passwordHash);
  return isPasswordMatched;
};

module.exports = mongoose.model("User", userSchema);
