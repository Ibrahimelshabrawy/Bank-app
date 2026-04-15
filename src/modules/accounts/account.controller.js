import {Router} from "express";
import {authentication} from "../../common/middlewares/authentication.middleware.js";
import Validation from "../../common/middlewares/validation.js";
import * as BS from "./account.service.js";

const accountRouter = Router();

accountRouter.post("/create-account", authentication, BS.createBankAccount);
accountRouter.post("/me", authentication, BS.getBankAccount);

export default accountRouter;
