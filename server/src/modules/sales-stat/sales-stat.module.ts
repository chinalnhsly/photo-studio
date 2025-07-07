import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesStat } from '../../entities/sales-stat.entity';
import { SalesStatService } from './sales-stat.service';
import { SalesStatController } from './sales-stat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalesStat])],
  providers: [SalesStatService],
  controllers: [SalesStatController],
  exports: [SalesStatService],
})
export class SalesStatModule {}
