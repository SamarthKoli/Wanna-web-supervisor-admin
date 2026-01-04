const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SOS = mongoose.model("SOS", sosSchema);

module.exports = SOS;
