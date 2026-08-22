import users from "../models/userModal.js";
import profiles from "../models/profileModal.js";
import { generateToken } from "../jwt.js";
import { isValidEmail, isValidPhone, isValidPassword } from "../middleware/security.js";

export const registerController = async (req, res) => {
  const regUser = req.body;

  try {
    // Additional server-side validation
    if (!isValidEmail(regUser.email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!isValidPhone(regUser.phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    if (!isValidPassword(regUser.password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character." });
    }

    // Check for duplicate email
    const userPresent = await users.findOne({ email: regUser.email });
    if (userPresent) {
      return res.status(400).json({ message: `${regUser.email}, Already exists.` });
    }

    // Create the user. Password is hashed automatically by the model's pre-save hook.
    const newUser = new users({
      uuid: regUser.uuid,
      profileImage: regUser.profileImage,
      name: regUser.name,
      email: regUser.email,
      password: regUser.password,
      phoneNumber: regUser.phoneNumber,
      DOB: regUser.DOB,
      address: regUser.address,
    });

    await newUser.save();

    // Create the associated profile document
    const newProfile = new profiles({
      uuid: regUser.uuid,
      profileImage: regUser.profileImage,
      name: regUser.name,
      email: regUser.email,
      phoneNumber: regUser.phoneNumber,
      contacts: [],
      favorites: [],
    });

    await newProfile.save();

    const token = generateToken(newUser);

    // Secure cookie settings
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(201).json({
      message: `${regUser.email}, Added successfully.`,
      token,
      user: {
        id: newUser._id,
        uuid: newUser.uuid,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account already exists." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
