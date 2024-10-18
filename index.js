const express = require("express");
const authRouter = require("./routes/authRoutes");
const connectionRouter = require("./routes/connectionRoutes");
const userRouters = require("./routes/userRoutes.js");
const dbConnect = require("./utils/dbConnect");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", connectionRouter);
app.use("/api", userRouters);

dbConnect()
  .then(() => {
    console.log("DB COnnected");
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });
