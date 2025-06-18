import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth/route.js";
import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./utils/connectDb.js";
import userRoute from "./routes/user/route.js";
import chatRouter from "./routes/chat/route.js";
config({
    path: "./.env",
});
// console.log("ALL  ENV", process.env.JWT_SECRET);
connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin || true);
    },
    credentials: true,
}));
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/chat", chatRouter);
app.use(errorHandler);
app.listen(process.env.PORT, () => {
    console.log("✅ Server is listening on PORT", process.env.PORT);
});
