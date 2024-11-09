// // middleware/upload.js

// import multer from "multer";
// import path from "path";

// // Configure storage and file naming
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Directory for storing uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// export const upload = multer({ storage: storage });

// middleware/upload.js

import multer from "multer";

// Configure in-memory storage
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
