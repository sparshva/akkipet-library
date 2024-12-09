const mongoose = require("mongoose");
const validator = require("validator"); // npm install validator
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true, // Ensure phone numbers are unique
      validate: {
        validator: function (v) {
          // You can customize the phone number format here
          // The example below is for international phone number formats
          return validator.isMobilePhone(v, "en-IN", { strictMode: false });
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Remove whitespace from beginning and end
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6, // Optionally set a minimum length for the password
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Continue with the save operation
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.setOtp = function (otp) {
  this.otp = otp;
  this.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
};

userSchema.methods.isOtpValid = function (inputOtp) {
  return this.otp === inputOtp && this.otpExpiresAt > new Date();
};

module.exports = mongoose.model("User", userSchema);
