import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundDto {
  @IsString()
  @ApiProperty({ description: '订单编号' })
  outTradeNo: string;

  @IsString()
  @ApiProperty({ description: '退款编号' })
  outRefundNo: string;

  @IsNumber()
  @ApiProperty({ description: '退款金额（分）' })
  refundFee: number;

  @IsString()
  @ApiProperty({ description: '退款原因' })
  refundReason: string;
}
