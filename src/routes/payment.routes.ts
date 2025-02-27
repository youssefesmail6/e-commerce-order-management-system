import { Router } from "express";
import ValidationMiddleware from "../middlewares/validation.middleware";
import ConfirmPaymentDto from "../dtos/confirmPayment.dto";
import paymentController from "../controllers/payment.controller";
import asyncHandler from "../middlewares/async-handler";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import AttachPaymentDto from "../dtos/attachPaymentDto";

export default async () => {
  const router = Router();
  router.post(
    "/v1/payment/attach-method",
    IsAuthenticatedMiddleware,
    ValidationMiddleware(AttachPaymentDto),
    asyncHandler(paymentController.attachPaymentMethod.bind(paymentController))
  );
  router.post(
    "/v1/payment/confirm",
    IsAuthenticatedMiddleware,
    ValidationMiddleware(ConfirmPaymentDto),
    asyncHandler(paymentController.confirmPayment.bind(paymentController)),
  );

  return router;
};
