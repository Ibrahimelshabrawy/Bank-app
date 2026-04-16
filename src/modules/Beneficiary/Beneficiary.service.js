import {errorMessage} from "../../common/utils/response/failed.response.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_service from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import beneficiaryModel from "../../DB/models/beneficiary.model.js";

export const createBeneficiary = async (req, res, next) => {
  const {accountNumber, bankName, nickName} = req.body;

  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {accountNumber},
  });
  if (!account) {
    errorMessage({
      message: "Account Not Found",
      status: 404,
    });
  }

  const myAccount = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });
  if (myAccount.accountNumber === accountNumber) {
    errorMessage({
      message: "Can Not Add Yourself as beneficiary",
      status: 400,
    });
  }

  const beneficiaryExist = await db_service.findOne({
    model: beneficiaryModel,
    filter: {accountNumber, ownerUserId: req.user._id},
  });

  if (beneficiaryExist) {
    errorMessage({
      message: "Account Already Exist",
      status: 400,
    });
  }

  const beneficiary = await db_service.create({
    model: beneficiaryModel,
    data: {
      ownerUserId: req.user._id,
      nickName,
      bankName,
      accountNumber,
    },
  });

  successResponse({
    res,
    status: 201,
    message: "Beneficiary Created Successfully 🥳🥳",
    data: beneficiary,
  });
};

export const getBeneficiaries = async (req, res, next) => {
  const beneficiaries = await db_service.find({
    model: beneficiaryModel,
    filter: {
      ownerUserId: req.user._id,
    },
    options: {
      lean: true,
    },
  });

  successResponse({
    res,
    message: "Beneficiaries fetched successfully",
    status: 200,
    data: beneficiaries,
  });
};
