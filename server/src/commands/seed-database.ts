import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seed } from '../data/seed';
import { DataSource } from 'typeorm'; // 更新导入

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource); // 使用 DataSource 替代 getConnection
    await seed(dataSource);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
