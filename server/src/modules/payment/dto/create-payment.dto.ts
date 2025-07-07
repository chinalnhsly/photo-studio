import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsString()
  @ApiProperty({ description: '订单编号' })
  outTradeNo: string;

  @IsNumber()
  @ApiProperty({ description: '支付金额（分）' })
  totalFee: number;

  @IsString()
  @ApiProperty({ description: '商品描述' })
  description: string;

  @IsString()
  @ApiProperty({ description: '用户openid' })
  openid: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '支付方式', required: false })
  paymentMethod?: string;
}
