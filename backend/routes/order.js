import express from "express";
import {
  createOrders,
  updateOrderStatus,
  processReturn,
  getOrdersByPhoneNumber,
  getOrdersGroupedByStatus,
  exportOrders,
  getTotalCountOfOrders,
} from "../controllers/orders.js";
import { authenticateAdmin } from "../middlewares/user.js"; // Import the adminMiddleware

const router = express.Router();

router.post("/create-order", createOrders);

router.put("/update/:orderId/:action", authenticateAdmin, updateOrderStatus);

router.post("/export", authenticateAdmin, exportOrders);

router.put("/return/:orderId", authenticateAdmin, processReturn);

router.get(
  "/orders/grouped-by-status",
  authenticateAdmin,
  getOrdersGroupedByStatus
);

router.get("/total-orders", getTotalCountOfOrders);

export default router;
