const Connection = require("../models/connection.model.js");
const User = require("../models/auth.model.js");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    console.log(fromUserId, toUserId);
    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      throw new Error("status not valid " + status);
    }
    const toUser = await User.findById(toUserId).select("firstName");
    if (!toUser) {
      throw new Error("To User not found!");
    }
    console.log(toUser);

    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnection) {
      throw new Error("Connection already exists");
    }

    const connection = new Connection({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connection.save();

    res.status(201).json({
      message:
        status +
        " request send from " +
        req.user.firstName +
        " to " +
        toUser.firstName,
      data,
    });
  } catch (err) {
    console.log("connection send error ", err.message);
    res.status(400).json({
      message: err.message,
    });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      res.status(400).send("status not supported " + status);
    }

    const connectionRequest = await Connection.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested",
    })
      .populate("toUserId", USER_SAFE_DATA)
      .populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequest) {
      res.status(400).send("No such request exist");
    }

    req.status = status;

    const data = await connectionRequest.save();

    res.status(200).json({ message: "connection Request " + status, data });
  } catch (err) {
    console.log("conn review error", err.message);
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  sendRequest,
  reviewRequest,
};
