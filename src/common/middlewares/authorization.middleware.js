import {errorMessage} from "../utils/response/failed.response.js";

export const authorization = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      errorMessage({
        message: "You Are Not Authorized ❗",
        status: 403,
      });
    }
  };
};
