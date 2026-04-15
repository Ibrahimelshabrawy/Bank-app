import {Types} from "mongoose";
import {RoleEnum} from "../../common/enum/user.enum.js";

import joi from "joi";

export const GeneralRules = {
  fullName: joi.string().min(3).max(30),
  email: joi.string().email(),
  password: joi.string().min(6).max(25).messages({
    "any.required": "Password is required",
  }),
  role: joi
    .string()
    .valid(...Object.values(RoleEnum))
    .messages({
      "any.required": "Role is required",
    }),

  id: joi.custom((value, helper) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : helper.message("Invalid ID 😥");
  }),
};

export const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};
