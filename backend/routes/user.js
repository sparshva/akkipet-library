import express from "express";
import {
  loginAdmin,
  createUser,
  deleteUser,
  getAllUsers,
  sendOtp,
  verifyOtp,
} from "../controllers/user.js";
import { authenticateAdmin } from "../middlewares/user.js"; // Import the adminMiddleware

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/create", authenticateAdmin, createUser);

router.get("/all-users", getAllUsers);

router.delete("/delete/:userId", authenticateAdmin, deleteUser);

export default router;
