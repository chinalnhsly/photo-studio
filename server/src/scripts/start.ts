import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import configuration from '../config/configuration';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const config = configuration();

  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(config.port);
    
    logger.log(`Application is running on: http://localhost:${config.port}`);
    logger.log(`Swagger documentation is available at: http://localhost:${config.port}/api`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
