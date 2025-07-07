import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { OrderStatusEnum } from './update-order.dto';

export class OrderQueryDto {
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
