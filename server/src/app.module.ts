import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 导入所有模块
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
// import { CampaignModule } from './modules/campaign/campaign.module'; // 暂时注释掉
import { ActivitiesModule } from './modules/activities/activities.module';
import { ProductImportModule } from './modules/product-import/product-import.module';
import { SalesStatModule } from './modules/sales-stat/sales-stat.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { MenuModule } from './modules/menu/menu.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { MemberModule } from './modules/member/member.module';
import { PaymentModule } from './modules/payment/payment.module';
import { BookingModule } from './modules/booking/booking.module';
import { PhotographerModule } from './modules/photographer/photographer.module';
import { StudioModule } from './modules/studio/studio.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'photostudio'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false),
        logging: configService.get('DB_LOGGING', false),
      }),
    }),
    
    // 业务模块
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    // CampaignModule, // 暂时注释掉
    ActivitiesModule,
    ProductImportModule,
    SalesStatModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    CouponModule,
    ActivityModule,
    AppointmentModule,
    MemberModule,
    PhotographerModule,
    BookingModule,
    StudioModule,
  ],
  controllers: [AppController], // 添加 AppController
  providers: [AppService],      // 添加 AppService
})
export class AppModule {}
