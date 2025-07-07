import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';

export enum OrderStatusEnum {
  Pending = 'pending',
  Paid = 'paid',
  Scheduled = 'scheduled',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;
}
