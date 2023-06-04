const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    password: String,
    userType: String,
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "UserInfo",
  }
);

const User =mongoose.model("UserInfo", UserDetailsSchema);
module.exports = User;