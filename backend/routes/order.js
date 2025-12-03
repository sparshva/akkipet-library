const express = require("express");
const {
  createOrders,
  updateOrderStatus,
  processReturn,
  getOrdersByPhoneNumber,
  getOrdersGroupedByStatus,
  exportOrders,
  getTotalCountOfOrders,
  getPaginatedOrders,
} = require("../controllers/orders.js");
const { authenticateAdmin } = require("../middlewares/user.js"); // Import the adminMiddleware

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

router.get("/all-orders", authenticateAdmin, getPaginatedOrders);

router.get("/total-orders", getTotalCountOfOrders);

router.post("/orders/by-phone-number", getOrdersByPhoneNumber);

module.exports = router;
