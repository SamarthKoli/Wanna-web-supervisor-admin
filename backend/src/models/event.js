const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  firestoreId: { type: String, required: true },
  city: { type: String },
  emergency_type: { type: String },
  emergency_message: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  notified_to: [{ type: String }],
  sos_clicked_by_email: { type: String },
  is_resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);