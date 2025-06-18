import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods, UserDocument } from "../types/model.js";

// Define the model type for clarity
type UserModel = Model<IUser, {}, IUserMethods>;

// Define the schema with TypeScript types
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Pre-save hook with typed 'this'
userSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Define the comparePassword method
userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Create and export the model
const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
