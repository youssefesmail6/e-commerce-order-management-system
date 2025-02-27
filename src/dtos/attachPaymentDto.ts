import { IsString } from "class-validator";

class AttachPaymentDto {
  @IsString()
  paymentIntentId!: string;
  @IsString()
  paymentMethodId!: string;
}

export default AttachPaymentDto;
