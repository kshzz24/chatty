import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { createChat, getAllChats, getChatDetails, } from "../../controllers/chat/chatController.js";
const chatRouter = express.Router();
chatRouter.post("/create", authMiddleware, createChat);
chatRouter.get("/all", authMiddleware, getAllChats);
chatRouter.get("/:chatId", authMiddleware, getChatDetails);
export default chatRouter;
