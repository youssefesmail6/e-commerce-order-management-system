import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/payment.service";
import BadRequestException from "../exceptions/bad-request.exception";

class PaymentController {
  public async attachPaymentMethod(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;

      if (!paymentIntentId || !paymentMethodId) {
        throw new BadRequestException(
          "Payment Intent ID and Payment Method ID are required.",
        );
      }

      await PaymentService.attachPaymentMethod(
        paymentIntentId,
        paymentMethodId,
      );

      res.status(200).json({
        success: true,
        message: "Payment method attached successfully.",
      });
    } catch (error: any) {
      next(
        new BadRequestException(
          `Failed to attach payment method: ${error.message}`,
        ),
      );
    }
  }

  public async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        throw new BadRequestException("Payment Intent ID is required.");
      }

      const paymentIntent =
        await PaymentService.confirmPayment(paymentIntentId);

      return res.status(200).json({
        success: true,
        message: "Payment confirmed successfully. Stock updated.",
        paymentIntent,
      });
    } catch (error: any) {
      next(
        new BadRequestException(
          `Payment confirmation failed: ${error.message}`,
        ),
      );
    }
  }
}

export default new PaymentController();
