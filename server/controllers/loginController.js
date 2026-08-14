import users from "../models/userModal.js";
import { generateToken } from "../jwt.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  try {
    // Fetch user including the password field (select: false by default).
    const userPresent = await users.findOne({ email }).select("+password");

    if (!userPresent) {
      console.log(`${email}, doesn't exists.`);
      res.status(404).json({ message: `${email}, doesn't exists.` });
      return;
    }

    // Compare the provided password with the stored hash.
    const isMatch = await userPresent.comparePassword(password);
    if (!isMatch) {
      console.log(`Password doesn't match.`);
      res.status(400).json({ message: `Password doesn't match.` });
      return;
    }

    console.log(`Logged in successfully.`);
    const token = generateToken(userPresent);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: false,
      secure: false,
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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};