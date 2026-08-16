import userModal from "../models/userModal.js";
import profileModal from "../models/profileModal.js";
import contactModal from "../models/contactModal.js";

/**
 * PUT /api/settings/profile
 * Updates the authenticated user's profile details.
 */
export const updateProfileController = async (req, res) => {
  const user = req.user;
  const { name, profileImage, phoneNumber, DOB, address } = req.body;

  try {
    if (name !== undefined) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (DOB !== undefined) user.DOB = DOB;
    if (address !== undefined) user.address = address;

    await user.save();

    // Keep the profile doc in sync.
    const updateData = {};
    if (name !== undefined) updateData.name = name;
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
    console.error(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      res.status(400).json({ message: messages.join(", ") });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * DELETE /api/auth/delete-account
 * Permanently deletes the authenticated user, profile, and all contacts.
 */
export const deleteAccountController = async (req, res) => {
  const user = req.user;
  const email = user.email;

  try {
    // Delete all contacts for this user.
    await contactModal.deleteMany({ savedUser: email });
    // Delete the profile doc.
    await profileModal.deleteOne({ email });
    // Delete the user account.
    await userModal.deleteOne({ _id: user._id });

    // Clear auth cookie.
    res.clearCookie("token", { path: "/" });

    res.status(200).json({ message: "Account deleted permanently." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};