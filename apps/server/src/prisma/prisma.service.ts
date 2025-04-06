import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  // 清理数据库连接
  async cleanDb() {
    if (process.env.NODE_ENV === 'development') {
      const modelNames = ['payment', 'orderDetail', 'order', 'inventory', 'product', 
                         'category', 'photoTask', 'customer', 'employee', 'user'];
      
      // 按照正确的顺序删除数据
      for (const model of modelNames) {
        // @ts-ignore - 动态访问 Prisma 模型
        await this[model].deleteMany();
      }
    }
  }
}
