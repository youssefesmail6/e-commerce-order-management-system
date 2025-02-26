import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller";
import asyncHandler from "../middlewares/async-handler";
import { IsAuthenticatedMiddleware, IsAdminMiddleware } from "../middlewares/auth.middleware";
import { adminRateLimiter } from "../middlewares/rateLimit.middleware";

export default async () => {
  const dashboardController = new DashboardController();
  const router = Router();

  router.get(
    "/v1/dashboard/sales-stats",
    adminRateLimiter,
    IsAuthenticatedMiddleware,
    IsAdminMiddleware,
    asyncHandler(dashboardController.getSalesStatistics.bind(dashboardController))
  );

  return router;
};
