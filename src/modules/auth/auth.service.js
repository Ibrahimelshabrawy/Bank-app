import {ACCESS_SECRET_KEY} from "../../../config/config.service.js";
import {errorMessage} from "../../common/utils/response/failed.response.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import {compare_match, Hash} from "../../common/utils/security/hash.js";
import {GenerateToken} from "../../common/utils/security/jwt.js";
import * as db_service from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const signUp = async (req, res, next) => {
  const {fullName, email, password, role} = req.body;

  const userExist = await db_service.findOne({
    model: userModel,
    filter: {email},
  });

  if (userExist) {
    errorMessage({
      message: "User Already Exist",
      status: 400,
    });
  }
  const user = await db_service.create({
    model: userModel,
    data: {
      fullName,
      email,
      password: await Hash({plainText: password}),
      role,
    },
  });

  successResponse({
    res,
    message: "User Sign Up Successfully 🥳",
    status: 201,
    data: user,
  });
};

export const signIn = async (req, res, next) => {
  const {email, password} = req.body;

  const userExist = await db_service.findOne({
    model: userModel,
    filter: {email},
    options: {
      lean: true,
    },
  });

  if (!userExist) {
    errorMessage({
      message: "User Not Exist",
      status: 400,
    });
  }

  if (
    !(await compare_match({
      plainText: password,
      cipherText: userExist.password,
    }))
  ) {
    errorMessage({
      message: "Password Not Correct ❗",
      cause: 400,
    });
  }

  const access_token = GenerateToken({
    payload: {id: userExist._id},
    secretKey: ACCESS_SECRET_KEY,
    options: {
      expiresIn: "1h",
    },
  });

  successResponse({
    res,
    message: "Sign In Successfully 🥳🥳",
    status: 200,
    data: {access_token},
  });
};
