import express from "express";
import { registerController } from "../controllers/registerController.js";
import { loginController } from "../controllers/loginController.js";
import { upload } from "../upload.js";
import { uploadController } from "../controllers/uploadController.js";

const routes = express.Router();

routes.post("/upload", upload.single("profileImage"), uploadController);
routes.post("/register", registerController);
routes.post("/login", loginController);

export default routes;
