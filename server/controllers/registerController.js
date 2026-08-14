import users from "../models/userModal.js";
import profiles from "../models/profileModal.js";
import { generateToken } from "../jwt.js";

export const registerController = async (req, res) => {
  const regUser = req.body;
  console.log(regUser);

  try {
    // Check for duplicate email.
    const userPresent = await users.findOne({ email: regUser.email });
    if (userPresent) {
      console.log(`${regUser.email}, Already exists.`);
      res.status(400).json({ message: `${regUser.email}, Already exists.` });
      return;
    }

    // Create the user. Password is hashed automatically by the model's
    // pre-save hook.
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

    // Create the associated profile document.
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

    console.log(`${regUser.email}, Added successfully.`);
    const token = generateToken(newUser);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: false,
      secure: false,
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
    console.error(error);
    // Mongoose validation errors.
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      res.status(400).json({ message: messages.join(", ") });
      return;
    }
    // Duplicate key error (email or uuid).
    if (error.code === 11000) {
      res.status(400).json({ message: "Account already exists." });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};