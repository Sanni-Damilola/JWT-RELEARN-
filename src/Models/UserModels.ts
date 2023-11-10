import mongoose, { Document, Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import { IUsers } from "../Interfaces/AllInterfaces";

interface AllUsers extends IUsers, Document {}

const UserSchema = new Schema<AllUsers>(
  {
    fullName: {
      type: String,
      required: [true, "Your Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Your email is required"],
      trim: true,
      lowercase: true,
      validate: [isEmail, "Please provide a valid  email"],
    },
    phoneNumber: {
      type: String,
    },
    token: {
      type: String,
      required: true,
    },
    OTP: {
      type: String,
      required: true,
    },
    OTPExpiry: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      alphanum: true,
    },
    confirmPassword: {
      type: String,
      required: true,
      alphanum: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    DOB: {
      type: String,
    },
    lastName: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModels = model<AllUsers>("Users", UserSchema);

export default UserModels;
