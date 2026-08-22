import userModal from "../models/userModal.js";
import profileModal from "../models/profileModal.js";
import contactModal from "../models/contactModal.js";
import { isValidPhone } from "../middleware/security.js";

export const updateProfileController = async (req, res) => {
  const user = req.user;
  const { name, profileImage, phoneNumber, DOB, address } = req.body;

  try {
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({ message: "Name must be between 2 and 50 characters." });
      }
      user.name = name.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (phoneNumber !== undefined) {
      if (!isValidPhone(String(phoneNumber))) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
      }
      user.phoneNumber = phoneNumber;
    }

    if (DOB !== undefined) {
      const dobDate = new Date(DOB);
      if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
        return res.status(400).json({ message: "Date of birth cannot be in the future." });
      }
      user.DOB = dobDate;
    }

    if (address !== undefined) {
      if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 200) {
        return res.status(400).json({ message: "Address must be between 5 and 200 characters." });
      }
      user.address = address.trim();
    }

    await user.save();

    const updateData = {};
    if (name !== undefined) updateData.name = user.name;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    await profileModal.findOneAndUpdate({ email: user.email }, updateData, { new: true });

    res.status(200).json({
      id: user._id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      phoneNumber: user.phoneNumber,
      DOB: user.DOB,
      address: user.address,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAccountController = async (req, res) => {
  const user = req.user;
  const email = user.email;

  try {
    await contactModal.deleteMany({ savedUser: email });
    await profileModal.deleteOne({ email });
    await userModal.deleteOne({ _id: user._id });

    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Account deleted permanently." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
