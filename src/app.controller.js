import express from "express";
import {PORT} from "../config/config.service.js";
import connectDB from "./DB/connectionDB.js";
import cors from "cors";
import {rateLimit} from "express-rate-limit";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.controller.js";
import accountRouter from "./modules/accounts/account.controller.js";
import transactionRouter from "./modules/transactions/transaction.controller.js";
import beneficiaryRouter from "./modules/Beneficiary/Beneficiary.controller.js";
const app = express();

export const bootstrap = async () => {
  const limiter = rateLimit({
    limit: 100,
    windowMs: 60 * 2,
  });

  app.use(cors("*"), helmet(), limiter, express.json());
  app.get("/", (req, res) => res.send("Hello World!"));

  connectDB();

  //routes
  app.use("/auth", authRouter);
  app.use("/account", accountRouter);
  app.use("/transaction", transactionRouter);
  app.use("/beneficiary", beneficiaryRouter);

  app.use("{/*demo}", (req, res, next) => {
    throw new Error(`The URL ${req.originalUrl} Is Not Found 😥`, {
      cause: 500,
    });
  });

  app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(err.cause || 500).json({message: err.message, stack: err.stack});
  });

  app.listen(PORT, () => console.log(`Bank app listening on PORT ${PORT}!`));
};
