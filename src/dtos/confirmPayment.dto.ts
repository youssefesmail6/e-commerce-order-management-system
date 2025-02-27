import { IsString } from "class-validator";

class ConfirmPaymentDto {
  @IsString()
  paymentIntentId!: string;
}

export default ConfirmPaymentDto;
