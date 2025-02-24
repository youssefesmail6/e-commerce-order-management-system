import { Router } from "express";
import ValidationMiddleware from "../middlewares/validation.middleware";
import AddUserDto from "../dtos/AddUser.dto";
import asyncHandler from "../middlewares/async-handler";
import UserController from "../controllers/user.controllers";

export default async () => {
  const userController = await UserController.init();
  const router = Router();

  router.post(
    "/v1/user/create-user",
    ValidationMiddleware(AddUserDto),
    asyncHandler(userController.createUser),
  );

  return router;
};
