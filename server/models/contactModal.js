import mongoose from "mongoose";

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
    },
    savedUser: {
      type: String,
      required: true,
    },
    contact_name: {
      type: String,
      required: true,
    },
    contact_role: {
      type: String,
      required: true,
    },
    contact_email: {
      type: String,
      required: true,
    },
    contact_phone: {
      type: Number,
      required: true,
    },
    contact_dob: {
      type: Date,
      required: true,
    },
    contact_relation: {
      type: String,
      required: true,
    },
    contact_address: {
      type: String,
      required: true,
    },
    contact_favorite: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("contacts", contactModal);
