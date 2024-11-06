const Connection = require("../models/connection.model.js");
const User = require("../models/auth.model.js");

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

    console.log("cns", connections);
    const data = connections.map((conn) => {
      if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return conn.toUserId;
      }

      return conn.fromUserId;
    });

    res.status(200).json({
      message: "connections fetched",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error in getting connections " + err.message);
  }
};

const feed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    console.log("pls", page, limit, skip);
    const hideUserFromFeed = new Set();

    const connectionRequests = await Connection.find({
      $or: [
        { toUserId: loggedInUser._id },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    });

    connectionRequests.forEach((conn) => {
      hideUserFromFeed.add(conn.toUserId.toString());
      hideUserFromFeed.add(conn.fromUserId.toString());
    });

    console.log("hod", hideUserFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: { _id: loggedInUser._id } } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    return res.status(400).send("error in feed");
  }
};
module.exports = {
  requests,
  connections,
  feed,
};
