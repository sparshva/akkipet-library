const express = require("express");
const {
  loginAdmin,
  createUser,
  deleteUser,
  getAllUsers,
  sendOtp,
  verifyOtp,
} = require("../controllers/user.js");
const { authenticateAdmin } = require("../middlewares/user.js"); // Import the adminMiddleware

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/create", authenticateAdmin, createUser);

router.get("/all-users", getAllUsers);

router.delete("/delete/:userId", authenticateAdmin, deleteUser);

module.exports = router;
