import express from "express";
import {
  getAllBooks,
  getBooksByFilterRequest,
  getUniqueValues,
  deleteSelectedBooks,
  uploadBooks,
  exportBooks,
} from "../controllers/books.js";
import { authenticateAdmin } from "../middlewares/user.js";
import { upload } from "../middlewares/upload.js";
import multer from "multer";

const router = express.Router();

router.get("/", getAllBooks);

router.post("/filter", getBooksByFilterRequest);

router.post("/import", upload.single("file"), authenticateAdmin, uploadBooks);

router.get("/export", authenticateAdmin, exportBooks);

router.get("/unique", getUniqueValues);

router.delete("/delete", authenticateAdmin, deleteSelectedBooks);

export default router;
