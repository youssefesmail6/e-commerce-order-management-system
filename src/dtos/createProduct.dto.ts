import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";
import { ProductCategory } from "../models/product";

class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsEnum(ProductCategory)
  category!: ProductCategory;

  @IsNumber()
  @Min(0)
  stock!: number;
}

export default CreateProductDto;
