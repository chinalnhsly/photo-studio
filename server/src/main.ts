import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = configuration();

  // 启用 CORS
  app.enableCors();

  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('影楼商城 API')
    .setDescription('影楼商城系统后端API文档')
    .setVersion('1.0')
    .addTag('auth', '认证模块')
    .addTag('bookings', '预约管理')
    .addTag('photographers', '摄影师管理')
    .addTag('products', '商品管理')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // 获取配置的端口或使用默认值
  const port = process.env.PORT || config.port;
  await app.listen(port);
  console.log(`应用程序运行在: http://localhost:${port}`);
  console.log(`Swagger UI 可访问: http://localhost:${port}/api`);
}

bootstrap();
