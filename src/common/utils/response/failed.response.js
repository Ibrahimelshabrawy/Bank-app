export const errorMessage = ({message = "Error", status = 500} = {}) => {
  throw new Error(message, {cause: status});
};
