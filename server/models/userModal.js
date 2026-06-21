import mongoose from "mongoose";

const userModal = new mongoose.Schema({
  uuid: {
    type: String,
    default: crypto.randomUUID(),
  },
  profileImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export default mongoose.model("users", userModal);
