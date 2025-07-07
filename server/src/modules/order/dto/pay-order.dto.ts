import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayOrderDto {
  @ApiProperty({
    description: '支付方式',
    example: 'wechat',
    enum: ['wechat', 'alipay', 'card']
  })
  @IsNotEmpty({ message: '支付方式不能为空' })
  @IsString({ message: '支付方式必须是字符串' })
  @IsIn(['wechat', 'alipay', 'card'], { message: '支付方式必须是wechat、alipay或card之一' })
  paymentMethod: string;
}
