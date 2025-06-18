import { NextFunction, Request, Response } from "express";
import { LoginBody, RegisterReqBody } from "../../types/apiTypes.js";
import User from "../../models/User.js";
import AppError from "../../utils/AppError.js";
import { clearCookie, sendToken } from "../../utils/auth.js";

export const registerUser = async (
  req: Request<{}, {}, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({ username, email, password });

    sendToken(user, res);
  } catch (err: any) {
    next(new AppError(err.message || "Error creating user", 500));
  }
};
export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      return next(new AppError("Email or password not found", 400));
    }

    const userDetails = await User.findOne({ email }).select("+password");

    if (!userDetails) {
      return next(new AppError("User not found", 400));
    }

    const isUserMatched = await userDetails.comparePassword(password);
    
    if (!isUserMatched) {
      return next(new AppError("Invalid email or password", 400));
    }

    sendToken(userDetails, res);
  } catch (err: any) {
    next(new AppError(err.message || "Error creating user", 500));
  }
};
export const logoutUser = async (req: Request, res: Response) => {
  try {
    clearCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error(err);
  }
};
