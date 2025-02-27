import Order, { OrderStatus } from "../models/order";
import OrderItem from "../models/orderItems";
import Product from "../models/product";
import { RedisService } from "./redis.service";
import Container from "typedi";
import { Logger } from "../services/logger.service";
import NotFoundException from "../exceptions/not-found.exception";
import BadRequestException from "../exceptions/bad-request.exception";
import CreateOrderDto from "../dtos/createOrder.dto";
import DBConnector from "../models";
import Payment, { PaymentStatus } from "../models/payment";
import paymentUtil from "../utils/payment.util";
class OrderService {
  private logger: Logger = Container.get(Logger);
  private redisClient = RedisService.getClient();
  private constructor() {}

  public static async init(): Promise<OrderService> {
    return new OrderService();
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const db = await DBConnector.getInstance();
    const transaction = await db.getTransaction();

    try {
        const { items } = createOrderDto;

        // Fetch product details by name
        const productNames = items.map((item) => item.name);
        const products = await Product.findAll({
            where: { name: productNames },
            transaction,
            lock: true,
        });

        if (products.length !== items.length) {
            throw new NotFoundException("One or more products not found.");
        }

        let totalPrice = 0;
        const orderItemsData = items.map((item) => {
            const product = products.find((p) => p.name === item.name);
            if (!product)
                throw new NotFoundException(`Product '${item.name}' not found.`);

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for '${item.name}'.`
                );
            }

            totalPrice += product.price * item.quantity;

            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const order = await Order.create(
            {
                userId,
                totalPrice,
                status: OrderStatus.PENDING, 
            },
            { transaction }
        );

        const paymentIntent = await paymentUtil.createPaymentIntent(
            userId,
            Math.round(totalPrice * 100),
            orderItemsData
        );

      
        await Payment.create(
            {
                orderId: order.id,
                paymentIntentId: paymentIntent.id,
                status: PaymentStatus.PENDING,
            },
            { transaction }
        );

        await transaction.commit();
        return { paymentIntentId: paymentIntent.id, totalPrice };
    } catch (error: any) {
        this.logger.error(`OrderService.createOrder: ${error.message}`);
        await transaction.rollback();
        throw error;
    }
}


  async getOrdersHistoryByUser(userId: string) {
    return await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
  }
  //get order by id
  async getOrderById(userId: string, orderId: string) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            include: [{ model: Product, attributes: ["name"] }],
          },
        ],
      });
      if (!order || order.userId !== userId) {
        throw new NotFoundException("Order not found.");
      }

      return order;
    } catch (error: any) {
      this.logger.error(`OrderService.getOrderById: ${error.message}`);
      throw error;
    }
  }
  public async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new NotFoundException(
        "Order not found or does not belong to the user.",
      );
    }

    order.status = status;
    await order.save();
    return order;
  }
}

export default OrderService;
