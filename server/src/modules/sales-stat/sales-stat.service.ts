import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SalesStat } from '../../entities/sales-stat.entity';

@Injectable()
export class SalesStatService {
  constructor(
    @InjectRepository(SalesStat)
    private readonly salesStatRepo: Repository<SalesStat>,
  ) {}

  async findByDateRange(start: Date, end: Date) {
    return this.salesStatRepo.find({
      where: { date: Between(start, end) },
      order: { date: 'ASC' },
    });
  }

  async findTopProducts(limit = 10) {
    return this.salesStatRepo
      .createQueryBuilder('stat')
      .select('stat.product_id', 'product_id')
      .addSelect('SUM(stat.quantity)', 'total_quantity')
      .groupBy('stat.product_id')
      .orderBy('total_quantity', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
