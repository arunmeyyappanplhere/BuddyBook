import users from "../models/userModal.js";
import profiles from "../models/profileModal.js";
import { generateToken } from "../jwt.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const checkUserExist = async (user) => {
  const userPresent = await users.findOne({ email: user.email });
  return userPresent ? true : false;
};

export const registerController = async (req, res) => {
  const regUser = req.body;
  console.log(regUser);

  try {
    const userPresent = await checkUserExist(regUser);
    console.log(userPresent);
    if (userPresent) {
      console.log(`${regUser.email}, Already exists.`);
      res.status(400).json({ message: `${regUser.email}, Already exists.` });
    } else {
      const newUser = new users({
        uuid: regUser.uuid,
        profileImage: regUser.profileImage,
        name: regUser.name,
        email: regUser.email,
        password: await bcrypt.hash(regUser.password, 10),
        phoneNumber: regUser.phoneNumber,
        DOB: regUser.DOB,
        address: regUser.address,
      });

      const newProfile = new profiles({
        uuid: regUser.uuid,
        profileImage: regUser.profileImage,
        name: regUser.name,
        email: regUser.email,
        phoneNumber: regUser.phoneNumber,
        contact: [],
        favorites: [],
      });

      await newUser.save();
      await newProfile.save();

      console.log(`${regUser.email}, Added successfully.`);
      const token = generateToken(newUser);
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
        secure: false,
        path: "/",
      });
      res
        .status(201)
        .json({ message: `${regUser.email}, Added successfully.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
