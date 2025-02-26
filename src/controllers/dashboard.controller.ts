import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { Logger } from "../services/logger.service";
import Order from "../models/order";
import { Sequelize } from "sequelize";

@Service()
class DashboardController {
  private logger: Logger = new Logger();

  public async getSalesStatistics(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // Get total orders
      const totalOrders = await Order.count();

      // Get total revenue (sum of all completed orders)
      const totalRevenue = await Order.sum("totalPrice", {
        where: { status: "delivered" },
      });

      // Get order count by status
      const orderStatusCounts = await Order.findAll({
        attributes: [
          "status",
          [Sequelize.literal("COUNT(*)"), "count"],
        ],
        group: ["status"],
        raw: true,
      });

      // Convert the result into a structured object
      const orderStats = orderStatusCounts.reduce(
        (acc, order: any) => {
          acc[order.status] = Number(order.count);
          return acc;
        },
        {} as Record<string, number>,
      );

      return res.status(200).json({
        totalOrders,
        totalRevenue: totalRevenue || 0,
        orderStats,
      });
    } catch (error: any) {
      this.logger.error(
        `DashboardController.getSalesStatistics: ${error.message}`,
      );
      next(error);
    }
  }
}

export default DashboardController;
