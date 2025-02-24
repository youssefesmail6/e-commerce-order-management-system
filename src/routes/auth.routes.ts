import { Router } from "express";
import AuthController from "../controllers/auth.controllers";
import ValidationMiddleware from "../middlewares/validation.middleware";
import LoginDto from "../dtos/login.dto";

export default async () => {
  const authController = await AuthController.init();
  const router = Router();

  router.post(
    "/v1/auth/login",
    ValidationMiddleware(LoginDto),
    authController.login,
  );


return router;
};
