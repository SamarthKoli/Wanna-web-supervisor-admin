const Joi = require("joi");
const userService = require("../services/signup");

// Updated Schema: Removed raw password requirement and added firebaseUid
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  firebaseUid: Joi.string().required(), // Required to link with Firebase
  role: Joi.string().valid("admin", "supervisor", "user").default("user"), // Added 'user' role
});

async function createdUser(req, res) {
  try {
    // 1. Validate the data sent from the React frontend
    const userData = await userSchema.validateAsync(req.body);

    // 2. Call the service layer to save the user into MongoDB
    const user = await userService.createdUser(userData);

    // 3. Send success response
    res.status(201).json({ 
      user, 
      message: "User data successfully mirrored to MongoDB" 
    });
  } catch (error) {
    console.error("Signup Controller Error:", error);

    // Handle validation errors from Joi
    if (error.isJoi) {
      return res.status(422).json({ message: error.message });
    }

    // Handle duplicate email errors (MongoDB unique constraint)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists in MongoDB" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createdUser };