const mongoose = require("mongoose");

// Define the schema for login/logout activity
const activitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  logins: {
    type: Number,
    required: true,
  },
  logouts: {
    type: Number,
    required: true,
  },
});

// Create a model based on the schema
const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
