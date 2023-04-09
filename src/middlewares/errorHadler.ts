import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

/**
 *  A custom error handler middleware
 *  Inspired by: Inspired by: https://www.smashingmagazine.com/2020/08/error-handling-nodejs-error-classes/
 * @param err - error
 * @param req - express request
 * @param res - express response
 * @param next - express next
 */
const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const status = err.status || 500;
    const msg = err.message || "";
    
    res.status(status).json({
      statusCode: status,
      message: msg,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
