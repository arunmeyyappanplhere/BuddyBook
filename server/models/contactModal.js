import mongoose from "mongoose";
import crypto from "crypto";

const contactModal = new mongoose.Schema(
  {
    contact_uid: {
      type: String,
      required: true,
      default: () => crypto.randomUUID(),
    },
    contact_profileImage: {
      type: String,
      required: true,
      trim: true,
    },
    savedUser: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contact_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Contact name must be at least 2 characters"],
      maxlength: [50, "Contact name cannot exceed 50 characters"],
    },
    contact_role: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    contact_relation: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Relation cannot exceed 50 characters"],
    },
    contact_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    contact_phone: {
      type: String, // Changed to String to preserve formatting
      required: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },
    contact_dob: {
      type: Date,
      required: true,
    },
    contact_address: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    contact_favorite: {
      type: Boolean,
      required: false,
      default: false,
    },
    contact_stashed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent duplicate contacts per user
contactModal.index({ savedUser: 1, contact_email: 1 }, { unique: true });

export default mongoose.model("contacts", contactModal);
