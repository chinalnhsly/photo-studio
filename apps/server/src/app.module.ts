import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class AppModule {}
