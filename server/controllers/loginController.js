import users from "../models/userModal.js";
import { generateToken } from "../jwt.js";
import { isValidEmail } from "../middleware/security.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const userPresent = await users.findOne({ email }).select("+password");

    if (!userPresent) {
      return res.status(404).json({ message: "Invalid email or password." });
    }

    const isMatch = await userPresent.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(userPresent);

    // Secure cookie settings
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      message: `${email}, logged in successfully.`,
      token,
      user: {
        id: userPresent._id,
        uuid: userPresent.uuid,
        name: userPresent.name,
        email: userPresent.email,
        profileImage: userPresent.profileImage,
        phoneNumber: userPresent.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
