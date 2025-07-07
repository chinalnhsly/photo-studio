import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRecord } from './entities/payment-record.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WechatPayService } from './providers/wechat-pay.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRecord])
  ],
  providers: [PaymentService, WechatPayService],
  controllers: [PaymentController],
  exports: [PaymentService, TypeOrmModule.forFeature([PaymentRecord])]
})
export class PaymentModule {}
