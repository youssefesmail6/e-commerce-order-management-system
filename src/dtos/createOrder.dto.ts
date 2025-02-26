import { IsArray, IsNotEmpty, IsNumber, Min, IsString } from "class-validator";

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export default class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  items!: OrderItemDto[];
}