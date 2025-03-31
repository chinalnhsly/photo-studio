import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // 设置更详细的日志级别
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('影楼管理系统 API')
    .setDescription('影楼管理系统后端接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(`服务器已启动: http://localhost:${port}/api-docs`);
  Logger.log(`环境: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
