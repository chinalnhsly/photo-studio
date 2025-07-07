import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(review: Partial<Review>) {
    return this.reviewRepository.save(review);
  }

  async findByProduct(productId: number) {
    return this.reviewRepository.find({ where: { product_id: productId } });
  }
}
