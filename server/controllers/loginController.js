import users from "../models/userModal.js";
import { generateToken } from "../jwt.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const checkUserExist = async (user) => {
  const userPresent = await users.findOne({ email: user.email });
  return userPresent;
};

export const loginController = async (req, res) => {
  const loginUser = req.body;
  console.log(loginUser);

  try {
    const userPresent = await checkUserExist(loginUser);
    console.log(userPresent);
    if (!userPresent) {
      console.log(`${loginUser.email}, doesn't exists.`);
      res.status(404).json({ message: `${loginUser.email}, doesn't exists.` });
    } else {
      console.log("Entered pass : ", loginUser.password);
      console.log("DB pass : ", userPresent.password);
      if (!(await bcrypt.compare(loginUser.password, userPresent.password))) {
        res.status(400).json({ message: `Password doesn't match.` });
        console.log(`Password doesn't match.`);
      } else {
        console.log(`Loged in successfully.`);
        const token = generateToken(loginUser);
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        res
          .status(200)
          .json({ message: `${loginUser.email}, Added successfully.` });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
