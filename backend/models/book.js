import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // nameInHindi: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // nameInEnglish: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    author: {
      type: String,
      // required: true,
      trim: true,
    },
    editor: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      // required: true,
      trim: true,
    },
    topic: {
      type: String,
      // required: true,
      trim: true,
    },
    language: {
      type: String,
      // required: true,
      trim: true,
    },
    status: {
      type: String, // Set the type to Boolean
      default: "AVAILABLE", // Default to 'AVAILABLE'
      enum: ["AVAILABLE", "NOT AVAILABLE", "DELETED"], // Available,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
