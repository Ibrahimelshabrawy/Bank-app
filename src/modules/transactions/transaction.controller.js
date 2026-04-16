import {Router} from "express";
import {authentication} from "../../common/middlewares/authentication.middleware.js";
import Validation from "../../common/middlewares/validation.js";
import * as TS from "./transaction.service.js";
import {
  amountCheckSchema,
  getTransactionSchema,
  transferSchema,
} from "./transaction.validation.js";

const transactionRouter = Router();

transactionRouter.post(
  "/depoist",
  authentication,
  Validation(amountCheckSchema),
  TS.deposit,
);

transactionRouter.post(
  "/withdraw",
  authentication,
  Validation(amountCheckSchema),
  TS.withdraw,
);

transactionRouter.post(
  "/transfer",
  authentication,
  Validation(transferSchema),
  TS.transfer,
);

transactionRouter.get("/my", authentication, TS.getTransactionsWithPagination);
transactionRouter.get("/my/summary", authentication, TS.getSummaryTransactions);

transactionRouter.get(
  "/:id",
  authentication,
  Validation(getTransactionSchema),
  TS.getTransaction,
);

export default transactionRouter;
