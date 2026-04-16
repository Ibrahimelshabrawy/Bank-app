import mongoose, {Types} from "mongoose";
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../common/enum/transaction.enum.js";

const transactionSchema = new mongoose.Schema(
  {
    beneficiaryId: {
      type: Types.ObjectId,
      ref: "Beneficiary",
    },
    accountId: {
      type: Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      required: true,
    },
    transactionStatus: {
      type: String,
      enum: Object.values(TransactionStatusEnum),
      default: TransactionStatusEnum.pending,
    },
    toAccountId: {
      type: Types.ObjectId,
      ref: "BankAccount",
    },
  },
  {
    timestamps: true,
    strictQuery: true,
  },
);

const transactionModel =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default transactionModel;
