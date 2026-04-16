import {Router} from "express";
import {authentication} from "../../common/middlewares/authentication.middleware.js";
import Validation from "../../common/middlewares/validation.js";
import * as BS from "./Beneficiary.service.js";
import {createBeneficiarySchema} from "./Beneficiary.validation.js";

const beneficiaryRouter = Router();

beneficiaryRouter.post(
  "/create-beneficiary",
  authentication,
  Validation(createBeneficiarySchema),
  BS.createBeneficiary,
);
beneficiaryRouter.get("/", authentication, BS.getBeneficiaries);

export default beneficiaryRouter;
