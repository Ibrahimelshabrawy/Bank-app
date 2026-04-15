import jwt from "jsonwebtoken";

export const GenerateToken = ({payload, secretKey, options = {}} = {}) => {
  return jwt.sign(payload, secretKey, options);
};

export const VerifyToken = ({token, secretKey, options = {}} = {}) => {
  return jwt.verify(token, secretKey, options);
};
