const Order = require("../models/order.js"); // Assuming you have the Order schema
const Book = require("../models/book.js"); // Assuming you have the Book schema

const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");

const createOrders = async (req, res) => {
  const session = await Book.startSession();
  session.startTransaction(); // Start a transaction
  // console.log(req.body);

  try {
    const {
      sahebjiName,
      samuday,
      contactName,
      contactNumber,
      address,
      city,
      pinCode,
      days,
      books,
      extraInfo,
    } = req.body;

    // Ensure required fields
    if (
      !contactName ||
      !contactNumber ||
      !Array.isArray(books) ||
      books.length === 0
    ) {
      return res.status(400).json({
        message: "Required fields are missing or books array is empty.",
      });
    }

    // Array to hold serial numbers of the books
    const serialNumbers = books.map((book) => book.serialNumber);

    // Check if all books are available
    const availableBooks = await Book.find({
      serialNumber: { $in: serialNumbers },
      status: "AVAILABLE",
    });

    // If the number of available books is less than the requested, throw an error
    if (availableBooks.length !== serialNumbers.length) {
      const unavailableDetails = books
        .filter(
          (book) =>
            !availableBooks.find(
              (availBook) => availBook.serialNumber === book.serialNumber
            )
        )
        .map((book) => `${book.serialNumber} (${book.nameInHindi})`)
        .join(", ");

      await session.abortTransaction();
      return res.status(404).json({
        message: `The following books are not available: ${unavailableDetails}`,
      });
    }

    // Create a new order for each available book
    const createdOrders = [];
    for (const book of books) {
      const { serialNumber, nameInHindi, nameInEnglish } = book;

      // Ensure each book has the necessary details
      if (!serialNumber || !(nameInHindi || nameInEnglish)) {
        return res.status(400).json({
          message: "Each book must have a serial number and a name.",
        });
      }

      // Reserve the book by updating its status
      await Book.findOneAndUpdate(
        { serialNumber: serialNumber, status: "AVAILABLE" },
        { $set: { status: "NOT AVAILABLE" } },
        { new: true, session } // Use the session for transaction
      );

      // Create a new order for the book
      // console.log({
      //   sahebjiName,
      //   samuday,
      //   contactName,
      //   contactNumber,
      //   address,
      //   city,
      //   pinCode,
      //   days,
      //   orderStatus: "PENDING",
      //   bookSerialNumber: serialNumber,
      //   bookName: nameInHindi,
      //   extraInfo,
      // });
      const newOrder = new Order({
        sahebjiName,
        samuday,
        contactName,
        contactNumber,
        address,
        city,
        pinCode,
        days,
        orderStatus: "PENDING",
        bookSerialNumber: serialNumber,
        bookName: nameInHindi || nameInEnglish,
        extraInfo,
      });

      // Save the order in the session context
      await newOrder.save({ session });
      createdOrders.push(newOrder);
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      orders: createdOrders,
    });
  } catch (error) {
    // Abort transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating orders:", error);
    res.status(500).json({
      message: "Error creating the order",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    // console.log("process update ");
    const { orderId, action } = req.params;
    // console.log("order id ", orderId, " action ", action);

    const order = await Order.findById(orderId);
    // console.log("update order status ");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (action === "accept") {
      order.orderStatus = "ACCEPTED";
    } else if (action === "reject") {
      order.orderStatus = "REJECTED";
      await Book.findOneAndUpdate(
        { serialNumber: order.bookSerialNumber }, // Query based on serial number
        { status: "AVAILABLE" }, // Update operation
        { new: true } // Option to return the updated document
      );
    }

    order.acceptedOrRejectedBy = req.user.name;
    order.updatedAt = new Date();
    order.acceptedOrRejectedAt = new Date();
    // console.log("order updated");

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const processReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    // console.log("process return ");
    // console.log("order id ", orderId);

    if (!order || order.orderStatus !== "ACCEPTED") {
      return res
        .status(400)
        .json({ message: "Order not found or not in ACCEPTED status" });
    }

    // Update the order status to RETURNED and set the return date
    order.returnAcceptedBy = req.user.name;
    order.orderStatus = "RETURNED";
    order.returnDate = new Date();

    // Update the book's status to AVAILABLE
    await Book.findOneAndUpdate(
      { serialNumber: order.bookSerialNumber }, // Query based on serial number
      { status: "AVAILABLE" }, // Update operation
      { new: true } // Option to return the updated document
    );

    // Save order and store in history
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getOrdersByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body; // Get phone number from query parameters

  // Check if phone number is provided
  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    // Fetch orders by phone number
    const orders = await Order.find({ contactNumber: phoneNumber }); // Query the orders collection

    // Send back the orders, even if it's an empty array
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders.",
      error: error.message,
    });
  }
};

const getTotalCountOfOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Send back the grouped orders
    res.status(200).json({ totalOrders: orders.length });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "An error occurred while fetching orders.",
      error: error.message,
    });
  }
};

const getOrdersGroupedByStatus = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Initialize an object to hold orders grouped by status
    const ordersGroupedByStatus = {
      PENDING: [],
      ACCEPTED: [],
      REJECTED: [],
      RETURNED: [],
    };

    // Loop through each order and group them by their status
    for (const order of orders) {
      const status = order.orderStatus;

      // Initialize an array for the status if it doesn't exist
      if (!ordersGroupedByStatus[status]) {
        ordersGroupedByStatus[status] = [];
      }

      // Push the order into the corresponding status array
      ordersGroupedByStatus[status].push(order);
    }

    // Send back the grouped orders
    res.status(200).json(ordersGroupedByStatus);
  } catch (error) {
    console.error("Error fetching orders grouped by status:", error);
    res.status(500).json({
      message: "An error occurred while fetching orders.",
      error: error.message,
    });
  }
};

const getPaginatedOrders = async (req, res) => {
  try {
    let { status = [], page = 1, limit = 20, search = "" } = req.query;

    // Convert query params
    if (typeof status === "string") status = [status]; // support both string or array
    page = parseInt(page);
    limit = parseInt(limit);

    // Build filter
    const filter = {};

    if (Array.isArray(status) && status.length > 0) {
      filter.orderStatus = { $in: status.map((s) => s.toUpperCase()) };
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { bookName: regex },
        { bookSerialNumber: regex },
        { contactName: regex },
        { contactNumber: regex },
        { sahebjiName: regex },
      ];
    }

    // Fetch orders paginated
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        hasMore: total > page * limit,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching paginated orders",
    });
  }
};

const exportOrders = async (req, res) => {
  let { statuses, searchQuery } = req.body;

  try {
    // console.log("exportOrders", statuses);
    // console.log("searchQuery", searchQuery);
    searchQuery = searchQuery.trim();

    // Fetch all orders based on the provided statuses
    const orders = await Order.find({ orderStatus: { $in: statuses } });
    const filtered = orders.filter(
      (order) =>
        order.bookName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bookSerialNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.contactNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.sahebjiName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Define columns for the worksheet
    worksheet.columns = [
      { header: "Sahebji Name", key: "sahebjiName", width: 20 },
      { header: "Samuday", key: "samuday", width: 15 },
      { header: "Contact Name", key: "contactName", width: 20 },
      { header: "Contact Number", key: "contactNumber", width: 15 },
      { header: "Address", key: "address", width: 30 },
      { header: "City", key: "city", width: 15 },
      { header: "Pin Code", key: "pinCode", width: 10 },
      { header: "Required For Days", key: "days", width: 10 },
      { header: "Extra Info", key: "extraInfo", width: 20 },
      { header: "Order Status", key: "orderStatus", width: 15 },
      { header: "Book Serial Number", key: "bookSerialNumber", width: 15 },
      { header: "Book Name", key: "bookName", width: 25 },

      {
        header: "Order Received Date",
        key: "createdAt",
        width: 15,
      },
      {
        header: "Accepted or Rejected Date",
        key: "acceptedOrRejectedAt",
        width: 20,
      },
      {
        header: "Accepted or Rejected By",
        key: "acceptedOrRejectedBy",
        width: 20,
      },
      {
        header: "Return Date",
        key: "returnDate",
        width: 15,
      },
      {
        header: "Return Accepted By",
        key: "returnAcceptedBy",
        width: 20,
      },
    ];

    // Format the date to YYYY-MM-DD
    const formatDate = (date) => (date ? date.toISOString().split("T")[0] : "");

    // Add rows of data to the worksheet
    filtered.forEach((order) => {
      worksheet.addRow({
        sahebjiName: order.sahebjiName,
        samuday: order.samuday,
        contactName: order.contactName,
        contactNumber: order.contactNumber,
        address: order.address,
        city: order.city,
        pinCode: order.pinCode,
        days: order.days,
        extraInfo: order.extraInfo,
        orderStatus: order.orderStatus,
        bookSerialNumber: order.bookSerialNumber,
        bookName: order.bookName,
        createdAt: formatDate(order.createdAt),
        acceptedOrRejectedAt: formatDate(order.acceptedOrRejectedAt),
        acceptedOrRejectedBy: order.acceptedOrRejectedBy,
        returnDate: formatDate(order.returnDate),

        returnAcceptedBy: order.returnAcceptedBy,
      });
    });

    // Set response headers to download the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting orders:", error);
    res.status(500).json({ message: "Error exporting orders" });
  }
};

module.exports = {
  exportOrders,
  processReturn,
  getOrdersByPhoneNumber,
  getOrdersGroupedByStatus,
  createOrders,
  getTotalCountOfOrders,
  updateOrderStatus,
  getPaginatedOrders,
};
