import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Tag } from '../modules/product/entities/tag.entity';
import { OrderItem } from '../modules/order/entities/order-item.entity';
import { PaymentRecord } from '../modules/payment/entities/payment-record.entity';
import { Booking } from '../modules/booking/entities/booking.entity';
import { TimeSlot } from '../modules/booking/entities/time-slot.entity';
import { Membership } from '../modules/membership/entities/membership.entity';
import { MembershipHistory } from '../modules/membership/entities/membership-history.entity';
import { ProductHistory } from '../modules/product/entities/product-history.entity';
// 删除已移除实体的导入
import { MembershipLevelLog } from '../modules/membership/entities/membership-level-log.entity'; 

// 手动指定实体，排除有问题的实体
export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'photostudio'),
  // 明确列出实体
  entities: [
    join(__dirname, '../modules/user/entities/user.entity{.ts,.js}'),
    join(__dirname, '../modules/product/entities/product.entity{.ts,.js}'),
    join(__dirname, '../modules/product/entities/category.entity{.ts,.js}'),
    join(__dirname, '../modules/product/entities/tag.entity{.ts,.js}'),
    join(__dirname, '../modules/order/entities/order.entity{.ts,.js}'),
    join(__dirname, '../modules/order/entities/order-item.entity{.ts,.js}'),
    join(__dirname, '../modules/auth/entities/refresh-token.entity{.ts,.js}'),
    join(__dirname, '../modules/membership/entities/membership.entity{.ts,.js}'),
    join(__dirname, '../modules/membership/entities/membership-history.entity{.ts,.js}'),
    join(__dirname, '../modules/product/entities/product-history.entity{.ts,.js}'),
    join(__dirname, '../modules/payment/entities/payment-record.entity{.ts,.js}'),
    join(__dirname, '../modules/booking/entities/booking.entity{.ts,.js}'),
    join(__dirname, '../modules/booking/entities/time-slot.entity{.ts,.js}'),
    // 删除已移除实体的文件路径
    join(__dirname, '../modules/membership/entities/membership-level-log.entity{.ts,.js}'),
    // 添加新实体
    Tag,
    OrderItem,
    PaymentRecord,
    Booking,
    TimeSlot,
    Membership,
    MembershipHistory,
    ProductHistory,
    // 删除已移除实体的引用
    MembershipLevelLog,
  ],
  // 关闭同步模式，改用迁移
  synchronize: false,
  logging: configService.get('DB_LOGGING') === 'true',
  extra: {
    max: 25,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
  maxQueryExecutionTime: 1000,
});
