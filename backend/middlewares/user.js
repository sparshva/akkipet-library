const User = require("../models/user.js"); // Assuming you have a User model
const jwt = require("jsonwebtoken"); // Make sure to import jwt

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("inside authenticateAdmin method");
  // console.log("Authentication", req.headers["authorization"]);

  if (!token) {
    return res.sendStatus(401); // Unauthorized - No token provided
  }

  try {
    // Verify the token and decode it
    // console.log("Verifying the token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract userId, name, and isAdmin from the token
    const { userId, phoneNumber, isAdmin } = decoded;

    // Check if all required fields are present
    if (!userId || !phoneNumber || isAdmin === undefined) {
      return res
        .status(401)
        .json({ message: "Missing required fields in token" }); // Bad Request
    }

    // Find the user by userId
    const user = await User.findById(userId);

    // If user does not exist, respond with 404
    if (!user) {
      return res.status(401).json({ message: "User not found" }); // User not found
    }

    // Check if the user's name matches the name in the token (optional)
    if (user.phoneNumber !== phoneNumber) {
      return res.status(401).json({ message: "Access denied. Admins only." }); // Forbidden
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(401).json({ message: "Access denied. Admins only." }); // Forbidden
    }

    // Attach the user document to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.sendStatus(401); // Forbidden - Token verification failed
  }
};

module.exports = { authenticateAdmin };
