import express from "express";
import { registerController } from "../controllers/registerController.js";
import { loginController } from "../controllers/loginController.js";
import { upload } from "../upload.js";
import { uploadController } from "../controllers/uploadController.js";
import { homeController } from "../controllers/homeController.js";
import { addContactController } from "../controllers/addContactController.js";
import logoutController from "../controllers/logoutController.js";

const routes = express.Router();

routes.post("/upload", upload.single("profileImage"), uploadController);
routes.post("/register", registerController);
routes.post("/login", loginController);
routes.get("/home", homeController);
routes.post("/add-contact", addContactController);
routes.post("/logout", logoutController);

export default routes;
