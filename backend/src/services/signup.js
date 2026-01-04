const User = require("../models/user");

async function createdUser(userData) {
    const { name, email, firebaseUid, role } = userData;

    const newUser = new User({
        name,
        email,
        firebaseUid,
        role: role || "user" // This now matches the new enum
    });

    return await newUser.save(); // This will no longer fail validation
}

module.exports = { createdUser };