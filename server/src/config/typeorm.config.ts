import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Photographer } from '../modules/photographer/entities/photographer.entity';
import { Booking } from '../modules/booking/entities/booking.entity';
import { BookingSlot } from '../modules/booking/entities/booking-slot.entity';
import { BookingFile } from '../modules/booking/entities/booking-file.entity';
import { TimeSlot } from '../modules/booking/entities/time-slot.entity';
import { User } from '../modules/user/entities/user.entity';
import { Product } from '../modules/product/entities/product.entity';
import { Category } from '../modules/product/entities/category.entity';
import { Tag } from '../modules/product/entities/tag.entity';
import { Order } from '../modules/order/entities/order.entity';
import { OrderItem } from '../modules/order/entities/order-item.entity';
import { Payment } from '../modules/payment/entities/payment.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'photostudio'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
    logging: configService.get<boolean>('DB_LOGGING', false),
    // 添加额外的配置
    ssl: configService.get<boolean>('DB_SSL', false) 
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
    // 连接池配置
    poolSize: configService.get<number>('DB_POOL_SIZE', 10),
    // 查询超时配置
    extra: {
      statement_timeout: configService.get<number>('DB_QUERY_TIMEOUT', 10000),
    },
  };
};
