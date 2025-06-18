import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
// Define the schema with TypeScript types
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
// Pre-save hook with typed 'this'
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 10);
});
// Define the comparePassword method
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
