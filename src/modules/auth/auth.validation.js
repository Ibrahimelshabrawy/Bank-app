import joi from "joi";
import {GeneralRules} from "../../common/utils/generalRules.js";

export const signUpSchema = {
  body: joi.object({
    fullName: GeneralRules.fullName.required(),
    email: GeneralRules.email.required(),
    password: GeneralRules.password.required(),
    role: GeneralRules.role,
  }),
};

export const signinSchema = {
  body: joi.object({
    email: GeneralRules.email.required(),
    password: GeneralRules.password.required(),
  }),
};
