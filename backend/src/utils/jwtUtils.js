const jwt = require("jsonwebtoken");
const { secretKey, expiresIn } = require("../configuration/jwtConfig");

function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  try {
    // Sign and return the JWT
    return jwt.sign(payload, secretKey, { expiresIn });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
}

module.exports = {
  generateToken,
};
