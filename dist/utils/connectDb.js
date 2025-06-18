import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(uri);
        console.log("✅ MongoDB connected successfully.");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Exit the process on failure
    }
};
export default connectDB;
