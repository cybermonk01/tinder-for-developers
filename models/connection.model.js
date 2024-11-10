const { Schema, default: mongoose } = require("mongoose");

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{Value} not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

module.exports = mongoose.model("Connection", connectionSchema);
