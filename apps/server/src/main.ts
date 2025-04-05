import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Photo Studio API')
    .setDescription('摄影工作室管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();
  
  app.setGlobalPrefix('api');

  await app.listen(3000, '0.0.0.0');
  
  const url = await app.getUrl();
  Logger.log(`服务器已启动: ${url}/api-docs`);
  Logger.log(`环境: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
