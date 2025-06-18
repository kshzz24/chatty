import mongoose, { HydratedDocument } from "mongoose";

// Define the status enum as a union type
export type UserStatus = "online" | "offline";

// Base interface for the User document
export interface IUser {
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  contacts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the User document's methods
export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

// Full User document type combining fields and methods
export type UserDocument = HydratedDocument<IUser, IUserMethods>;