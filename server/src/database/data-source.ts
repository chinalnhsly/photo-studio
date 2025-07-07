import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Photographer } from '../modules/photographer/entities/photographer.entity';
import { Booking } from '../modules/booking/entities/booking.entity';
import * as path from 'path';

// 确保在顶层加载配置模块，以便在 DataSource 初始化时可用
ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT'), 10),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [
    Photographer,
    Booking,
  ],
  migrations: [path.join(__dirname, '/../migrations/*{.ts,.js}')],
  synchronize: false,
  logging: configService.get<string>('DB_LOGGING') === 'true',
  migrationsTableName: 'typeorm_migrations',
});
