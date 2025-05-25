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

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS配置
  app.enableCors();

  // Swagger配置
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PhotoStudio API')
    .setDescription('影楼管理系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
  console.log(`Application is running on: http://localhost:${config.port}`);
}

bootstrap();
