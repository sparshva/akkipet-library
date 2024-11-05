import User from "../models/user.js"; // Assuming the user schema is in models/User.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import validator from "validator";
import otpGenerator from "otp-generator";
import Order from "../models/order.js"; // Import the Order model

dotenv.config();

export const loginAdmin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Check if the user exists and is an admin
    const user = await User.findOne({ phoneNumber });
    console.log(req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Validate the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token with 7 days expiration and include name
    const token = jwt.sign(
      {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        name: user.name, // Include the name in the token
      },
      process.env.JWT_SECRET, // Use a secret from your environment variables
      { expiresIn: "30d" } // Token expires in 7 days
    );

    // Respond with the token
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  const { phoneNumber, name, password } = req.body;

  try {
    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check if the phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this phone number already exists." });
    }

    // Create a new user (no need to hash password here, it's handled by pre-save middleware)
    const newUser = new User({
      phoneNumber,
      name,
      password, // The password will be hashed automatically by the pre-save hook
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params; // Extract the user ID from the request params

  try {
    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Validate phone number format
  const isValidPhone = validator.isMobilePhone(phoneNumber, "any", {
    strictMode: false,
  });
  if (!isValidPhone) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Check if user already exists; if not, create a new user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }

    // Set the OTP and expiration using the setOtp method
    user.setOtp(otp);
    await user.save();

    // Mock sending the OTP to the user’s phone
    console.log(`OTP sent to ${phoneNumber}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// Function to verify OTP
export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate the OTP using the isOtpValid method in the User schema
    if (!user.isOtpValid(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const orders = await Order.find({ contactNumber: phoneNumber });
    user.otp = undefined;
    user.otpExpirationDate = undefined;
    await user.save();

    res.status(200).json({
      message: "OTP verified",
      // token,
      orders, // Include the orders in the response
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};
