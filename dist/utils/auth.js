import jwt from "jsonwebtoken";
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const sendToken = (user, res) => {
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
const clearCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
};
export { sendToken, createToken, clearCookie };
