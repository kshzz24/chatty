import User from "../../models/User.js";
import AppError from "../../utils/AppError.js";
import { sendToken } from "../../utils/auth.js";
export const registerUser = async (req, res, next) => {
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
    }
    catch (err) {
        next(new AppError(err.message || "Error creating user", 500));
    }
};
