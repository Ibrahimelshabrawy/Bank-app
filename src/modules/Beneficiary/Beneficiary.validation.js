import joi from "joi";
import {GeneralRules} from "../../common/utils/generalRules.js";

export const createBeneficiarySchema = {
  body: joi.object({
    accountNumber: joi.string().required(),

    bankName: joi.string().required(),

    nickName: joi.string().min(2).max(30).required(),
  }),
};
