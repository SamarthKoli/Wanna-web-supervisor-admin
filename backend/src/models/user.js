const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    firebaseUid: { type: String, required: true, unique: true }, 
    // Set required to false since Firebase handles the actual password
    password: { type: String, required: false }, 
    role: { 
        type: String, 
        // 1. Removed "user" from enum as they use a separate app
        enum: ["admin", "supervisor"], 
        // 2. Default is supervisor for all website signups
        default: "supervisor" 
    },
    // 3. New supervisors start as unapproved until Admin accepts
    isApproved: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);