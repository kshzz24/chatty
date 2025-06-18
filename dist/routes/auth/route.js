import express from "express";
import { registerUser, loginUser, logoutUser, } from "../../controllers/auth/authController.js";
const authRoute = express.Router();
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.get("/logout", logoutUser);
export default authRoute;
