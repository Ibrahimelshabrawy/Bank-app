import joi from "joi";
import {GeneralRules} from "../../common/utils/generalRules.js";

export const amountCheckSchema = {
  body: joi.object({
    amount: joi.number().positive().required(),
  }),
};

export const transferSchema = {
  body: joi.object({
    amount: joi.number().positive().required(),
    beneficiaryId: GeneralRules.id.required(),
  }),
};

export const getTransactionSchema = {
  params: joi.object({
    id: GeneralRules.id.required(),
  }),
};
