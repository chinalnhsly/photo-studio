import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局配置
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('Photo Studio API')
    .setDescription('摄影工作室管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  
  Logger.log(`服务器已启动: http://localhost:3000/api-docs`);
  Logger.log(`环境: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
