import mongoose, {Types} from "mongoose";
import {
  BankAccountStatusEnum,
  CurrencyEnum,
} from "../../common/enum/bankAccount.enum.js";

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BankAccountStatusEnum),
      default: BankAccountStatusEnum.active,
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: Object.values(CurrencyEnum),
      default: CurrencyEnum.EGP,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

const bankAccountModel =
  mongoose.models.BankAccount ||
  mongoose.model("BankAccount", bankAccountSchema);

export default bankAccountModel;
