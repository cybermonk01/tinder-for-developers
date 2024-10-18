const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://cybermonk01:devTinder@cluster0.g0gft.mongodb.net/`,
      {}
    );
  } catch (err) {
    console.log("err", err.message);
  }
};

module.exports = dbConnect;
