import { IsEnum } from "class-validator";
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: "Invalid order status" })
  status!: OrderStatus;
}
