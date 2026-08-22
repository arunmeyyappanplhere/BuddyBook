import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPhone } from "../middleware/security.js";

const userModal = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
    },
    profileImage: {
      type: String,
      required: [true, "Profile image is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never return password by default
    },
    phoneNumber: {
      type: String, // Changed to String to preserve leading zeros and format
      required: [true, "Phone number is required"],
      validate: {
        validator: (v) => isValidPhone(v),
        message: "Phone number must be 10 digits",
      },
    },
    DOB: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: (v) => v <= new Date(),
        message: "Date of birth cannot be in the future",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
  },
  { timestamps: true },
);

// Hash password before saving
userModal.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12); // Increased rounds for better security
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare a candidate password with the stored hash
userModal.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("users", userModal);
