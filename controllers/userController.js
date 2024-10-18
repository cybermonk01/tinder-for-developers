const Connection = require("../models/connection.model");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const requests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await Connection.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    console.log("req", requests);
    if (!requests) {
      throw new Error("no new requests found!");
    }

    res.status(200).json({
      message: "New Request found!",
      requests,
    });
  } catch (err) {
    res.status(400).send("error in getting requests ", err.message);
  }
};

const connections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await Connection.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    if (!connections) {
      throw new Error("No Connections");
    }

    res.status(200).json({
      message: "connections fetched",
      connections,
    });
  } catch (err) {
    res.status(400).send("Error in getting connections " + err.message);
  }
};

module.exports = {
  requests,
  connections,
};
