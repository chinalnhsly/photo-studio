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

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'photostudio'),
  // 明确列出核心实体，避免自动扫描导致问题
  entities: [
    Photographer,
    Booking,
    BookingSlot,
    BookingFile,
    TimeSlot,
    User,
    Product,
    Category,
    Tag,
    Order,
    OrderItem,
    Payment,
    RefreshToken
  ],
  // 关闭自动同步，避免枚举类型问题
  synchronize: false,
  // 减少日志输出量
  logging: configService.get('DB_LOGGING') === 'true',
});
