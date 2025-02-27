import Stripe from "stripe";
import env from "../config/env.config";
import Payment, { PaymentStatus } from "../models/payment";
import Order, { OrderStatus } from "../models/order";
import OrderItem from "../models/orderItems";
import Product from "../models/product";
import BadRequestException from "../exceptions/bad-request.exception";

// Initialize Stripe
const stripe = new Stripe(env.STRIPE.SECRET_KEY);

class PaymentService {
    public async attachPaymentMethod(paymentIntentId: string, paymentMethodId: string) {
        if (!paymentIntentId || !paymentMethodId) {
            throw new BadRequestException("Payment Intent ID and Payment Method ID are required.");
        }

        await stripe.paymentIntents.update(paymentIntentId, {
            payment_method: paymentMethodId,
        });
    }

    public async confirmPayment(paymentIntentId: string) {
        if (!paymentIntentId) {
            throw new BadRequestException("Payment Intent ID is required.");
        }

        // Confirm payment with Stripe
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            throw new BadRequestException("Payment confirmation failed.");
        }

        // Find the payment record
        const payment = await Payment.findOne({ where: { paymentIntentId } });
        if (!payment) {
            throw new BadRequestException("Payment record not found.");
        }

        await payment.update({ status: PaymentStatus.SUCCESS });

        const order = await Order.findByPk(payment.orderId, {
            include: [{ model: OrderItem, include: [Product] }],
        });

        if (!order) {
            throw new BadRequestException("Order not found.");
        }

        await order.update({ status: OrderStatus.PROCESSING });

        for (const orderItem of order.orderItems) {
            if (orderItem.product) {
                await orderItem.product.decrement("stock", { by: orderItem.quantity });
            }
        }

        return paymentIntent;
    }
}

export default new PaymentService();
