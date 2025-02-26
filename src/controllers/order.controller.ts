import Container from "typedi";
import { Logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { JwtDto } from "../dtos/jwt.dto";
import CreateOrderDto from "../dtos/createOrder.dto";
import { convertToCSV } from "../utils/export.util";
import { UpdateOrderStatusDto } from "../dtos/updateOrderStatus.dto";
import WebSocketService from "../services/websocket.service";


class OrderController {
  private logger: Logger = Container.get(Logger);
  private orderService: OrderService;
private websocketService: WebSocketService = Container.get(WebSocketService);


  private constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  public static init = async (): Promise<OrderController> => {
    const service = await OrderService.init();
    return new OrderController(service);
  };

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.jwt as JwtDto).userId;
      const createOrderDto = req.body as CreateOrderDto;

      const order = await this.orderService.createOrder(userId, createOrderDto);

      return res.status(201).json(order);
    } catch (error: any) {
      this.logger.error(`OrderController.createOrder: ${error.message}`);
      next(error);
    }
  }

  async getUserHistoryOrders(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = (req.jwt as JwtDto).userId;

      const orders = await this.orderService.getOrdersHistoryByUser(userId);
      const totalOrders = orders.length;

      if (totalOrders === 0) {
        return res.status(200).json({ message: "No orders history yet" });
      }

      return res.json({ totalOrders, orders });
    } catch (error: any) {
      this.logger.error(`OrderController.getUserOrders: ${error.message}`);
      next(error);
    }
  }
  //get order by id
  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = (req.jwt as JwtDto).userId;
      const orderId = req.params.orderId;

      const order = await this.orderService.getOrderById(userId, orderId);

      return res.json(order);
    } catch (error: any) {
      this.logger.error(`OrderController.getOrderById: ${error.message}`);
      next(error);
    }
  }
  public exportOrdersToCSV = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = (req.jwt as JwtDto).userId;

      const orders = await this.orderService.getOrdersHistoryByUser(userId);

      const updatedOrders = orders.map((order) => ({
        ...order.get(),
        orderItems: order.orderItems
          .map(
            (item) =>
              `${item.product.name} (x${item.quantity}) - $${item.price}`,
          )
          .join(" | "),
        items: order.orderItems
          .map((item) => `${item.product.name} (x${item.quantity})`)
          .join(" | "),
      }));

      const csvContent = convertToCSV([...updatedOrders]);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=orders.csv`);
      res.send(csvContent);
    } catch (error: any) {
      this.logger.error(`OrderController.exportOrdersToCSV: ${error.message}`);
      next(error);
    }
  };
  public updateOrderStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orderId } = req.params;
      const updateOrderDto = req.body as UpdateOrderStatusDto;
      

      // Update the order in the database
      const updatedOrder = await this.orderService.updateOrderStatus(
        orderId,
        updateOrderDto.status,
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Emit WebSocket event
      this.websocketService.emitOrderUpdate(updatedOrder.userId, {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
      });


      res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error: any) {
        this.logger.error(`OrderController.updateOrderStatus: ${error.message}`);
      next(error);
    }
  };
}

export default OrderController;
