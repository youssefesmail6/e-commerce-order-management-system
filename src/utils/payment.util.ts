import Stripe from "stripe";
import env from "../config/env.config";
import BadRequestException from "../exceptions/bad-request.exception";

class PaymentUtils {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE.SECRET_KEY);
  }

  public async createPaymentIntent(
    userId: string,
    amount: number,
    orderItems: { productId: string; quantity: number; price: number }[],
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount / 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { userId, items: JSON.stringify(orderItems) },
      });

      return paymentIntent;
    } catch (error: any) {
      throw new BadRequestException(
        `Payment creation failed: ${error.message}`,
      );
    }
  }

  public async getPaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      throw new BadRequestException(
        `Failed to retrieve payment intent: ${error.message}`,
      );
    }
  }
}

export default new PaymentUtils();
