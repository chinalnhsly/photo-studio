import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInput {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}
