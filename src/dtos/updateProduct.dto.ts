import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { ProductCategory } from "../models/product";

class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}

export default UpdateProductDto;
