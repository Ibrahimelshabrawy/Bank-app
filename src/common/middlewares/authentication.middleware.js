import {ACCESS_SECRET_KEY, PREFIX} from "../../../config/config.service.js";
import {findOne} from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import {errorMessage} from "../utils/response/failed.response.js";
import {VerifyToken} from "../utils/security/jwt.js";

export const authentication = async (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization) {
    errorMessage({
      message: "Token Is Required ❗",
      status: 403,
    });
  }

  const [prefix, token] = authorization.split(" ");
  if (prefix !== PREFIX) {
    errorMessage({
      message: "Invalid Prefix ❗",
      status: 400,
    });
  }
  const verify = VerifyToken({token, secretKey: ACCESS_SECRET_KEY});
  if (!verify || !verify?.id) {
    errorMessage({
      message: "Invalid Token",
      status: 400,
    });
  }

  const user = await findOne({
    model: userModel,
    filter: {_id: verify.id},
  });
  if (!user) {
    errorMessage({
      message: "User Not Exist ❗",
      status: 404,
    });
  }
  req.verify = verify;
  req.user = user;
  next();
};
