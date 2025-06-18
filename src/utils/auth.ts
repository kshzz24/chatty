import jwt from "jsonwebtoken";
import { UserDocument } from "../types/model.js";
import { Response } from "express";

const createToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

const sendToken = (user: UserDocument, res: Response) => {
  const token = createToken(user._id.toString());
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  console.log(user, "userDetails");

  res.status(200).json({
    message: "Auth Success",
    user,
    token: token,
  });
};

const clearCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};
export { sendToken, createToken, clearCookie };
