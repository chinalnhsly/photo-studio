import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImport } from '../../entities/product-import.entity';
import { ProductImportService } from './product-import.service';
import { ProductImportController } from './product-import.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImport])],
  providers: [ProductImportService],
  controllers: [ProductImportController],
  exports: [ProductImportService],
})
export class ProductImportModule {}
