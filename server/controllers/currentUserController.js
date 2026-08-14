import users from "../models/userModal.js";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (without password).
 * Protected by JWT middleware (protect) in the route.
 */
export const getCurrentUserController = async (req, res) => {
  try {
    const user = await users.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({
      id: user._id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      phoneNumber: user.phoneNumber,
      DOB: user.DOB,
      address: user.address,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};