import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: '商品ID',
    example: 1
  })
  @IsNotEmpty({ message: '商品ID不能为空' })
  @IsNumber({}, { message: '商品ID必须是数字' })
  productId: number;

  @ApiProperty({
    description: '购买数量',
    example: 1
  })
  @IsNotEmpty({ message: '购买数量不能为空' })
  @IsNumber({}, { message: '购买数量必须是数字' })
  @Min(1, { message: '购买数量必须大于0' })
  quantity: number;
}
