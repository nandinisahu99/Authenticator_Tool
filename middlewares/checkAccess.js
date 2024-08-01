import { ErrorHandler } from "../utils/ErrorHandler.js";
export const checkAccess = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return next(new ErrorHandler(400, "Unauthorized access"));
  }
};
