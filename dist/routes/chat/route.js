import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
const chatRouter = express.Router();
chatRouter.post("/create", authMiddleware);
export default chatRouter;
