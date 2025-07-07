import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async findAll() {
    return this.couponRepo.find();
  }

  async findOne(id: number) {
    return this.couponRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Coupon>) {
    return this.couponRepo.save(data);
  }

  async update(id: number, data: Partial<Coupon>) {
    await this.couponRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.couponRepo.delete(id);
    return { success: true };
  }
}
