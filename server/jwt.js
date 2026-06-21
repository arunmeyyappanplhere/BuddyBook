import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  const jwtSecret = process.env.JWT_LOGIN_SECRET;
  return jwt.sign({ email: user.email }, jwtSecret, { expiresIn: "1h" });
};
