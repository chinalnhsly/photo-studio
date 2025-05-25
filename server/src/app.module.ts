import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// 使用新的 TypeORM 配置
import { getTypeOrmConfig } from './config/typeorm.config';

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

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
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
  ],
})
export class AppModule {}
