import mongoose from "mongoose";
import validator from "validator"; // npm install validator

const orderSchema = new mongoose.Schema(
  {
    sahebjiName: {
      type: String,
      trim: true,
    },
    samuday: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, "Contact Name is required"], // Set as required
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact Number is required"], // Set as required
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "en-IN", { strictMode: false });
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    extraInfo: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // Assuming pin code is 6 digits
        },
        message: (props) => `${props.value} is not a valid 6-digit Pin Code!`,
      },
    },
    days: {
      type: Number,
      min: [1, "Days must be at least 1"],
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "RETURNED"],
      default: "PENDING",
    },
    bookSerialNumber: {
      type: String,
      required: [true, "Book Serial Number is required"],
      trim: true,
    },
    bookName: {
      type: String,
      required: [true, "Book Name is required"],
      trim: true,
    },
    returnDate: { type: Date }, // Date when the book was returned
    createdAt: { type: Date, default: Date.now },
    acceptedOrRejectedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Order", orderSchema);
