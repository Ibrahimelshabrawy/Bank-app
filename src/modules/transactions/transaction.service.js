import mongoose from "mongoose";
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../common/enum/transaction.enum.js";
import {errorMessage} from "../../common/utils/response/failed.response.js";
import * as db_service from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import transactionModel from "../../DB/models/transaction.model.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import {BankAccountStatusEnum} from "../../common/enum/bankAccount.enum.js";

export const deposit = async (req, res, next) => {
  const {amount} = req.body;

  if (!amount || amount <= 0) {
    errorMessage({
      message: "Amount must be greater than 0",
      status: 400,
    });
  }

  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });

  if (!account) {
    errorMessage({
      message: "Account Not Found",
      status: 404,
    });
  }

  if (account.status !== BankAccountStatusEnum.active) {
    errorMessage({
      message: "Account is not active",
      status: 400,
    });
  }

  const balanceBefore = account.balance;
  const balanceAfter = balanceBefore + amount;

  account.balance = balanceAfter;
  await account.save();

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: account._id,
      amount,
      balanceBefore,
      balanceAfter,
      transactionType: TransactionTypeEnum.deposit,
      transactionStatus: TransactionStatusEnum.completed,
    },
  });

  successResponse({
    res,
    message: "Deposit successful",
    status: 201,
    data: transaction,
  });
};

export const withdraw = async (req, res, next) => {
  const {amount} = req.body;

  if (!amount || amount <= 0) {
    errorMessage({
      message: "Amount must be greater than 0",
      status: 400,
    });
  }

  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });

  if (!account) {
    errorMessage({
      message: "Account Not Found",
      status: 404,
    });
  }

  if (account.status !== BankAccountStatusEnum.active) {
    errorMessage({
      message: "Account is not active",
      status: 400,
    });
  }

  if (account.balance < amount) {
    errorMessage({
      message: "Insufficient Balance",
      status: 400,
    });
  }

  const balanceBefore = account.balance;
  const balanceAfter = balanceBefore - amount;

  account.balance = balanceAfter;
  await account.save();

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: account._id,
      amount,
      balanceBefore,
      balanceAfter,
      transactionType: TransactionTypeEnum.withdraw,
      transactionStatus: TransactionStatusEnum.completed,
    },
  });

  successResponse({
    res,
    message: "Withdraw successful",
    status: 201,
    data: transaction,
  });
};

// Chatgpt help me in this case (Not Worked Due To MongoDB Error)
export const transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {amount, toAccountNumber} = req.body;

    if (!amount || amount <= 0) {
      return errorMessage({
        message: "Amount must be greater than 0",
        status: 400,
      });
    }

    const senderAccount = await bankAccountModel.findOne({
      userId: req.user._id,
    });

    if (!senderAccount) {
      return errorMessage({
        message: "Sender account not found",
        status: 404,
      });
    }

    if (senderAccount.status !== BankAccountStatusEnum.active) {
      return errorMessage({
        message: "Sender account not active",
        status: 400,
      });
    }

    if (senderAccount.accountNumber === toAccountNumber) {
      return errorMessage({
        message: "Cannot transfer to same account",
        status: 400,
      });
    }

    const receiverAccount = await bankAccountModel.findOne({
      accountNumber: toAccountNumber,
    });

    if (!receiverAccount) {
      return errorMessage({
        message: "Receiver account not found",
        status: 404,
      });
    }

    if (receiverAccount.status !== BankAccountStatusEnum.active) {
      return errorMessage({
        message: "Receiver account not active",
        status: 400,
      });
    }

    if (senderAccount.balance < amount) {
      return errorMessage({
        message: "Insufficient Balance",
        status: 400,
      });
    }

    const senderBalanceBefore = senderAccount.balance;
    const senderBalanceAfter = senderBalanceBefore - amount;

    senderAccount.balance = senderBalanceAfter;

    receiverAccount.balance += amount;

    await senderAccount.save({session});
    await receiverAccount.save({session});

    const transaction = await transactionModel.create(
      [
        {
          accountId: senderAccount._id,
          toAccountId: receiverAccount._id,
          amount,
          balanceBefore: senderBalanceBefore,
          balanceAfter: senderBalanceAfter,
          transactionType: TransactionTypeEnum.transfer,
          transactionStatus: TransactionStatusEnum.completed,
        },
      ],
      {session},
    );

    await session.commitTransaction();
    session.endSession();

    successResponse({
      res,
      message: "Transfer successful",
      status: 201,
      data: transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  const {id} = req.params;

  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });

  if (!account) {
    errorMessage({
      message: "Account Not Found",
      status: 404,
    });
  }

  const transaction = await db_service.findOne({
    model: transactionModel,
    filter: {
      _id: id,
      accountId: account._id,
    },
    options: {
      lean: true,
    },
  });
  if (!transaction) {
    errorMessage({
      message: "Transaction Not Found ❗",
      status: 404,
    });
  }

  successResponse({
    res,
    message: "Transaction Found Successfully 🥳",
    data: transaction,
  });
};
