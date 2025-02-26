import { Router } from "express";
import OrderController from "../controllers/order.controller";
import ValidationMiddleware from "../middlewares/validation.middleware";
import asyncHandler from "../middlewares/async-handler";
import { IsAdminMiddleware, IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import CreateOrderDto from "../dtos/createOrder.dto";
import { adminRateLimiter, generalLimiter } from "../middlewares/rateLimit.middleware";
import { UpdateOrderStatusDto } from "../dtos/updateOrderStatus.dto";

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
  // Get Order by Id
  router.get(
    "/v1/order/:orderId",
    IsAuthenticatedMiddleware,
    asyncHandler(orderController.getOrderById.bind(orderController))
  );
  // Export Orders to CSV
  router.get(
    "/v1/orders/export",
    IsAuthenticatedMiddleware,
    asyncHandler(orderController.exportOrdersToCSV.bind(orderController))
  );
// Update Order Status
  router.put(
    "/v1/order/:orderId/update-status",
    adminRateLimiter,
    IsAuthenticatedMiddleware,
    IsAdminMiddleware,
    ValidationMiddleware(UpdateOrderStatusDto),
    asyncHandler(orderController.updateOrderStatus.bind(orderController))
  );
  return router;
};
