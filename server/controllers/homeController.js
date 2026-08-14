import profileModal from "../models/profileModal.js";

/**
 * GET /api/home
 * Returns the authenticated user's profile (including embedded contacts).
 * Protected by JWT middleware (protect) in the route.
 */
export const homeController = async (req, res) => {
  try {
    const userProfileDetails = await profileModal.findOne({
      email: req.user.email,
    });
    if (userProfileDetails) {
      res.status(200).json(userProfileDetails);
    } else {
      res.status(400).json({ message: "User profile not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};