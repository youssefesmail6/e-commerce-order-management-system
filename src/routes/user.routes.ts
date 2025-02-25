import { Router } from "express";
import ValidationMiddleware from "../middlewares/validation.middleware";
import AddUserDto from "../dtos/addUser.dto";
import asyncHandler from "../middlewares/async-handler";
import UserController from "../controllers/user.controllers";
import { createAccountLimiter } from "../middlewares/rateLimit.middleware";

export default async () => {
  const userController = await UserController.init();
  const router = Router();

  router.post(
    "/v1/user/create-user",
    createAccountLimiter,
    ValidationMiddleware(AddUserDto),
    asyncHandler(userController.createUser),
  );

  return router;
};
