import {Router} from "express";
import * as AS from "./auth.service.js";
import Validation from "../../common/middlewares/validation.js";
import * as AV from "./auth.validation.js";

const authRouter = Router();

authRouter.post("/signup", Validation(AV.signUpSchema), AS.signUp);
authRouter.post("/signin", Validation(AV.signinSchema), AS.signIn);

export default authRouter;
