const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const booksRouter = require("./routes/books.js");
const userRouter = require("./routes/user.js");
const orderRouter = require("./routes/order.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("mongoose connection failed", error.message);
    process.exit(1);
  }
};

connectDb();

app.get("/", (req, res) => {
  console.log("Hello world");
  res.send("Hello, world!"); // Send response to the client
});

app.use("/books", booksRouter);

app.use("/user", userRouter);

app.use("/order", orderRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 5000}`);
});
