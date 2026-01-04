const Joi = require("joi");
const authService = require("../services/login");

// Define validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function login(req, res) {
  try {
    // Validate input
    const { email, password } = await loginSchema.validateAsync(req.body);

    // Authenticate user
    const { token, user } = await authService.login(email, password);

    // Respond with token and user information
    res.status(200).json({ 
      token, 
      user: { email: user.email, role: user.role }, 
      message: "Login successful" 
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.isJoi) {
      return res.status(400).json({ message: error.message });
    }

    // Handle authentication failure
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Handle unexpected errors
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { login };
