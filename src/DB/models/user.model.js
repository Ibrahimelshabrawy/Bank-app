import mongoose from "mongoose";
import {RoleEnum} from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
