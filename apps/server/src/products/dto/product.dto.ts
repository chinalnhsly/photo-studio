import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '婚纱摄影套餐' })
  @IsString()
  name: string;

  @ApiProperty({ example: '专业婚纱摄影服务，包含化妆和照片精修' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2999.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  stock?: number;
}

export class ProductFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
