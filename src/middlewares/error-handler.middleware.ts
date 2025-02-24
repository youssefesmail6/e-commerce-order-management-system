import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";

const ErrorHandlerMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const errors = error.errors || [];
  const message = error.message || "Something went wrong";

  // Force JSON response
  response.status(status).json({
    errors,
    status,
    message,
  });
};

export default ErrorHandlerMiddleware;
