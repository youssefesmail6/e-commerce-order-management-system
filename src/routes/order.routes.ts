import { Router } from "express";
import OrderController from "../controllers/order.controller";
import ValidationMiddleware from "../middlewares/validation.middleware";
import asyncHandler from "../middlewares/async-handler";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import CreateOrderDto from "../dtos/createOrder.dto";
import { generalLimiter } from "../middlewares/rateLimit.middleware";

export default async () => {
  const orderController = await OrderController.init();
  const router = Router();

  // Create Order
  router.post(
    "/v1/order/create-order",
    generalLimiter,
    IsAuthenticatedMiddleware,
    ValidationMiddleware(CreateOrderDto),
    asyncHandler(orderController.createOrder.bind(orderController))
  );



// Get User Orders 
  router.get(
    "/v1/orders",
    IsAuthenticatedMiddleware,
    asyncHandler(orderController.getUserHistoryOrders.bind(orderController))
  );

  return router;
};
