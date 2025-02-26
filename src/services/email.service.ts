import nodemailer from "nodemailer";
import { Logger } from "./logger.service";
import Container, { Service } from "typedi";
import Order from "../models/order";

@Service()
class EmailService {
  private logger: Logger = Container.get(Logger);

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendOrderStatusEmail(order: Order, email: string) {
    try {
      if (!email) {
        this.logger.error("Email not found.");
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Order Status Updated: ${order.status}`,
        text: `Dear Customer, \n\nYour order with ID ${order.id} has been updated to ${order.status}. You can track it in real-time.\n\nThank you for shopping with us!`,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info(
        `Order status email sent to ${email} for Order ID ${order.id}`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to send order status email: ${error.message}`);
    }
  }
}

export default EmailService;
