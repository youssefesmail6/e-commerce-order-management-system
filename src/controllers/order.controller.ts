import Container from "typedi";
import { Logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response, NextFunction } from "express";
import OrderService from "../services/order.service";
import { JwtDto } from "../dtos/jwt.dto";
import CreateOrderDto from "../dtos/createOrder.dto";

class OrderController {
    private logger: Logger = Container.get(Logger);
    private orderService: OrderService;

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

    async getUserHistoryOrders(req: AuthRequest, res: Response, next: NextFunction) {
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
}

export default OrderController;
