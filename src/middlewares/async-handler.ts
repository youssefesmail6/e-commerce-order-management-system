import { Request, Response, NextFunction } from "express";

// Wraps async functions to catch errors and pass them to Express error handler
export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;