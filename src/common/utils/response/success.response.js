export const successResponse = ({
  res,
  message = "Success",
  data = undefined,
  status = 200,
} = {}) => {
  return res.status(status).json({
    message,
    data,
  });
};
