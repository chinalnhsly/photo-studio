import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';  // 添加这一行
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';  // 更新导入路径

@Module({
  imports: [
    UsersModule,
    PrismaModule,  // 添加这一行
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],  // 添加 JwtAuthGuard
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtAuthGuard],      // 导出 JwtAuthGuard
})
export class AuthModule {}
