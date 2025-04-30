import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { WechatPayService } from './providers/wechat-pay.service';
import { PaymentRecord } from './entities/payment-record.entity';
import { PaymentCallback } from './entities/payment-callback.entity';
import { OrderModule } from '../order/order.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentRecord,
      PaymentCallback
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('PAYMENT_HTTP_TIMEOUT', 5000),
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
    OrderModule, // 依赖订单模块
    RedisModule, // 使用Redis处理支付回调幂等性
    ConfigModule, // 配置模块，用于微信支付配置
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    WechatPayService,
    {
      provide: 'PAYMENT_CONFIG',
      useFactory: (configService: ConfigService) => ({
        wechat: {
          appId: configService.get('WECHAT_APP_ID'),
          mchId: configService.get('WECHAT_MCH_ID'),
          apiKey: configService.get('WECHAT_API_KEY'),
          notifyUrl: configService.get('WECHAT_NOTIFY_URL'),
          refundNotifyUrl: configService.get('WECHAT_REFUND_NOTIFY_URL'),
          pfx: configService.get('WECHAT_PFX_PATH'),
        },
        alipay: {
          // 支付宝配置（如果需要）
          appId: configService.get('ALIPAY_APP_ID'),
          privateKey: configService.get('ALIPAY_PRIVATE_KEY'),
          publicKey: configService.get('ALIPAY_PUBLIC_KEY'),
          notifyUrl: configService.get('ALIPAY_NOTIFY_URL'),
        }
      }),
      inject: [ConfigService],
    }
  ],
  exports: [PaymentService, WechatPayService], // 导出服务以便其他模块使用
})
export class PaymentModule {}
