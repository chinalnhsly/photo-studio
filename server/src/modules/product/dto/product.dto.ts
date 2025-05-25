import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  stock: number;

  @IsString()
  category: string;

  @IsBoolean()
  is_active: boolean;
}
