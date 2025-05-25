import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'photostudio'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  ssl: configService.get('NODE_ENV') === 'production',
  logging: configService.get('DB_LOGGING', 'false') === 'true',
  autoLoadEntities: true,
  keepConnectionAlive: true,
  extra: {
    max: 25,
    connectionTimeoutMillis: 5000,
  },
});
