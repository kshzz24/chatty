import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  acceptRequest,
  allCurrentInvites,
  getAllContactsDetails,
  getAllUsers,
  getCurrentUserDetails,
  rejectRequest,
  sendInvites,
} from "../../controllers/user/userController.js";

const userRoute = express.Router();
userRoute.get("/list", authMiddleware, getAllUsers);
userRoute.get("/details", authMiddleware, getCurrentUserDetails);
userRoute.post("/contact/details", authMiddleware, getAllContactsDetails);
userRoute.post("/invite/send", authMiddleware, sendInvites);
userRoute.get("/invite/me", authMiddleware, allCurrentInvites);
userRoute.post("/invite/accept", authMiddleware, acceptRequest);
userRoute.post("/invite/reject", authMiddleware, rejectRequest);

export default userRoute;
