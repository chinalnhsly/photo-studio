import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}

export class OrderFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ required: false, enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
