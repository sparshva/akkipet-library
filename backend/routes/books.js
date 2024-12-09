const express = require("express");
const {
  getAllBooks,
  getBooksByFilterRequest,
  getUniqueValues,
  deleteSelectedBooks,
  uploadBooks,
  exportBooks,
} = require("../controllers/books.js");
const { authenticateAdmin } = require("../middlewares/user.js");
const { upload } = require("../middlewares/upload.js");
const multer = require("multer");

const router = express.Router();

router.get("/", getAllBooks);

router.post("/filter", getBooksByFilterRequest);

router.post("/import", upload.single("file"), authenticateAdmin, uploadBooks);

router.get("/export", authenticateAdmin, exportBooks);

router.get("/unique", getUniqueValues);

router.delete("/delete", authenticateAdmin, deleteSelectedBooks);

module.exports = router;
