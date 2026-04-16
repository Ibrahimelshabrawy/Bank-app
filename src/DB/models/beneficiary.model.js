import mongoose, {Types} from "mongoose";
import {BankNameEnum} from "../../common/enum/beneficiary.enum.js";

const beneficiarySchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountNumber: {
      type: String,
      trim: true,
      required: true,
    },
    bankName: {
      type: String,
      enum: Object.values(BankNameEnum),
      default: BankNameEnum.CIB,
    },
    nickName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

const beneficiaryModel =
  mongoose.models.Beneficiary ||
  mongoose.model("Beneficiary", beneficiarySchema);

export default beneficiaryModel;
