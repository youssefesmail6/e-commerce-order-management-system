import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../exceptions/unauthorized.exception";
import ForbiddenAccessException from "../exceptions/forbidden-access.exception";
import env from "../config/env.config";
import jwt from "jsonwebtoken";
import { JwtDto } from "../dtos/jwt.dto";
import { RoleNames } from "../models/user";

export interface AuthRequest extends Request {
  jwt?: JwtDto;
}

const verifyToken = (token: string): JwtDto => {
  try {
    return jwt.verify(token, env.AUTH.SECRET as string) as JwtDto;
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired token");
  }
};

export const IsAuthenticatedMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new UnauthorizedException("No token provided"));
    }

    const token = authorization.split(" ")[1];
    req.jwt = verifyToken(token);
    return next();
  } catch (err: any) {
    res.setHeader("Www-Authenticate", "Bearer");
    return next(new UnauthorizedException(err.message));
  }
};

export const IsAdminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.jwt?.role === RoleNames.ADMIN) {
    return next();
  } else {
    return next(
      new ForbiddenAccessException(
        "You are not authorized to perform this action.",
      ),
    );
  }
};
