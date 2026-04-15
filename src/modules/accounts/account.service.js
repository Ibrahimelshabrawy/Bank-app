import {generateAccountNumber} from "../../common/utils/generalRules.js";
import {errorMessage} from "../../common/utils/response/failed.response.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_service from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";

export const createBankAccount = async (req, res, next) => {
  const {currency} = req.body;

  const accountExist = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });
  if (accountExist) {
    errorMessage({
      message: "Account Already Exist",
      status: 400,
    });
  }

  const account = await db_service.create({
    model: bankAccountModel,
    data: {
      userId: req.user._id,
      currency,
      accountNumber: await generateAccountNumber(),
    },
  });

  successResponse({
    res,
    message: "Sign In Successfully 🥳🥳",
    status: 200,
    data: {account},
  });
};

export const getBankAccount = async (req, res, next) => {
  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });

  if (!account) {
    errorMessage({
      message: "Account Not Exist",
      status: 400,
    });
  }

  successResponse({
    res,
    message: "Success",
    data: account,
  });
};
