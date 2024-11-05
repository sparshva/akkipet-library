import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
import booksRouter from "./routes/books.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

app.use(express.json());
app.use(
  cors({
    credentials: true,
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
    console.error(error);
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
