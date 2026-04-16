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
import beneficiaryModel from "../../DB/models/beneficiary.model.js";

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

// Chatgpt help me in this case
export const transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const {amount, beneficiaryId} = req.body;

    if (!amount || amount <= 0) {
      errorMessage({
        message: "Amount must be greater than 0",
        status: 400,
      });
    }

    const senderAccount = await db_service.findOne({
      model: bankAccountModel,
      filter: {userId: req.user._id},
      options: {session},
    });
    if (!senderAccount) {
      errorMessage({
        message: "Sender account not found",
        status: 404,
      });
    }

    if (senderAccount.status !== BankAccountStatusEnum.active) {
      errorMessage({
        message: "Sender account not active",
        status: 400,
      });
    }

    const beneficiary = await db_service.findOne({
      model: beneficiaryModel,
      filter: {_id: beneficiaryId, ownerUserId: req.user._id},
      options: {session},
    });

    if (!beneficiary) {
      errorMessage({
        message: "Beneficiary not found",
        status: 404,
      });
    }

    const receiverAccount = await db_service.findOne({
      model: bankAccountModel,
      filter: {accountNumber: beneficiary.accountNumber},
      options: {session},
    });

    if (!receiverAccount) {
      errorMessage({
        message: "Receiver account not found",
        status: 404,
      });
    }

    if (receiverAccount.status !== BankAccountStatusEnum.active) {
      errorMessage({
        message: "Receiver account not active",
        status: 400,
      });
    }

    if (senderAccount.accountNumber === receiverAccount.accountNumber) {
      errorMessage({
        message: "Cannot transfer to yourself",
        status: 400,
      });
    }

    if (senderAccount.balance < amount) {
      errorMessage({
        message: "Insufficient balance",
        status: 400,
      });
    }

    const senderBalanceBefore = senderAccount.balance;

    senderAccount.balance -= amount;

    receiverAccount.balance += amount;

    await senderAccount.save({session});

    await receiverAccount.save({session});

    const transaction = await db_service.create({
      model: transactionModel,
      data: {
        accountId: senderAccount._id,
        toAccountId: receiverAccount._id,
        beneficiaryId,
        amount,

        balanceBefore: senderBalanceBefore,
        balanceAfter: senderAccount.balance,

        transactionType: TransactionTypeEnum.transfer,
        transactionStatus: TransactionStatusEnum.completed,
      },
      options: {session},
    });
    await session.commitTransaction();
    session.endSession();

    successResponse({
      res,
      message: "Transfer completed successfully",
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

// Chatgpt help me in this case
export const getTransactionsWithPagination = async (req, res, next) => {
  let {page = 1, limit = 5} = req.query;

  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  const account = await db_service.findOne({
    model: bankAccountModel,
    filter: {userId: req.user._id},
  });

  if (!account) {
    errorMessage({
      message: "Account Not Found❗",
      status: 404,
    });
  }

  const filter = {
    $or: [{accountId: account._id}, {toAccountId: account._id}],
  };

  const transactions = await db_service.find({
    model: transactionModel,
    filter,
    options: {
      skip,
      limit,
      lean: true,
      populate: [
        {path: "accountId", select: "accountNumber balance"},
        {path: "beneficiaryId", select: "nickName bankName"},
      ],
    },
  });

  if (!transactions.length) {
    errorMessage({
      message: "There Is No Transactions❗",
      status: 404,
    });
  }

  const totalTransactions = await db_service.countDocuments({
    model: transactionModel,
    filter,
  });

  successResponse({
    res,
    status: 200,
    message: "Transactions Fetched Successfully",
    data: {
      page,
      limit,
      totalTransactions,
      transactions,
    },
  });
};

// Chatgpt help me in this case
export const getSummaryTransactions = async (req, res, next) => {
  let totalDeposites = 0;
  let totalWithdraws = 0;
  let totalTransfers = 0;

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

  const summary = await transactionModel.aggregate([
    {
      $match: {
        accountId: account._id,
      },
    },
    {
      $group: {
        _id: "$transactionType",
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  summary.forEach((item) => {
    if (item._id === TransactionTypeEnum.deposit) {
      totalDeposites += item.totalAmount;
    }
    if (item._id === TransactionTypeEnum.withdraw) {
      totalWithdraws += item.totalAmount;
    }
    if (item._id === TransactionTypeEnum.deposit) {
      totalTransfers += item.totalAmount;
    }
  });

  successResponse({
    res,
    message: "Account Summary Fetched Successfully 🥳",
    status: 200,
    data: {
      totalDeposites,
      totalTransfers,
      totalWithdraws,
      currentBalance: account.balance,
    },
  });
};
