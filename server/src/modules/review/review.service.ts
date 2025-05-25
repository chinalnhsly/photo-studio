import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Photographer } from '../photographer/entities/photographer.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import * as Excel from 'exceljs';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Photographer)
    private photographerRepository: Repository<Photographer>,
  ) {}

  // 获取所有评价
  async findAll(options: any = {}) {
    const {
      page = 1,
      limit = 10,
      userId,
      photographerId,
      bookingId,
      rating,
      isPublic,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.booking', 'booking')
      .leftJoinAndSelect('review.photographer', 'photographer')
      .leftJoinAndSelect('review.images', 'images');

    if (userId) {
      queryBuilder.andWhere('review.userId = :userId', { userId });
    }

    if (photographerId) {
      queryBuilder.andWhere('review.photographerId = :photographerId', { photographerId });
    }

    if (bookingId) {
      queryBuilder.andWhere('review.bookingId = :bookingId', { bookingId });
    }

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere('review.isPublic = :isPublic', { isPublic });
    }

    // 排序
    queryBuilder.orderBy(`review.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  }

  // 获取摄影师评价
  async findByPhotographer(photographerId: number, options: any = {}) {
    options.photographerId = photographerId;
    options.isPublic = true;
    return this.findAll(options);
  }

  // 获取用户评价
  async findByUser(userId: number, options: any = {}) {
    options.userId = userId;
    return this.findAll(options);
  }

  // 获取单个评价
  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'booking', 'photographer', 'images'],
    });

    if (!review) {
      throw new NotFoundException(`评价ID ${id} 不存在`);
    }

    return review;
  }

  // 创建评价
  async create(createReviewDto: CreateReviewDto) {
    // 检查预约是否存在且已完成
    const booking = await this.bookingRepository.findOne({
      where: { id: createReviewDto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`预约ID ${createReviewDto.bookingId} 不存在`);
    }

    if (booking.status !== 'completed') {
      throw new BadRequestException('只能评价已完成的预约');
    }

    // 检查是否已经评价过
    const existingReview = await this.reviewRepository.findOne({
      where: { bookingId: createReviewDto.bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('该预约已经评价过了');
    }

    // 创建评价
    const review = this.reviewRepository.create({
      userId: createReviewDto.userId,
      bookingId: createReviewDto.bookingId,
      photographerId: createReviewDto.photographerId || booking.photographerId,
      rating: createReviewDto.rating,
      content: createReviewDto.content,
      isAnonymous: createReviewDto.isAnonymous || false,
      isRecommended: createReviewDto.isRecommended || false,
      isPublic: true,
      tags: createReviewDto.tags || [],
    });

    const savedReview = await this.reviewRepository.save(review);

    // 如果有图片，保存图片
    if (createReviewDto.imageUrls && createReviewDto.imageUrls.length > 0) {
      const images = createReviewDto.imageUrls.map((url, index) => {
        return this.reviewImageRepository.create({
          reviewId: savedReview.id,
          url,
          sortOrder: index,
        });
      });

      savedReview.images = await this.reviewImageRepository.save(images);
    }

    // 更新摄影师评分
    if (review.photographerId) {
      await this.updatePhotographerRating(review.photographerId);
    }

    return savedReview;
  }

  // 更新评价
  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    // 更新评价
    Object.assign(review, updateReviewDto);

    // 如果修改了评分，需要重新计算摄影师评分
    if (updateReviewDto.rating && updateReviewDto.rating !== review.rating) {
      review.rating = updateReviewDto.rating;
      if (review.photographerId) {
        await this.updatePhotographerRating(review.photographerId);
      }
    }

    // 保存更新
    return this.reviewRepository.save(review);
  }

  // 回复评价
  async reply(id: number, replyDto: ReplyReviewDto) {
    const review = await this.findOne(id);

    // 修改为与实体定义一致的属性名
    review.reply = replyDto.reply;
    review.replyTime = new Date();

    return this.reviewRepository.save(review);
  }

  // 删除评价
  async remove(id: number) {
    const review = await this.findOne(id);
    const photographerId = review.photographerId;

    // 删除评价
    await this.reviewRepository.remove(review);

    // 重新计算摄影师评分
    if (photographerId) {
      await this.updatePhotographerRating(photographerId);
    }

    return { success: true };
  }

  // 获取评价统计
  async getReviewStats(photographerId?: number) {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(review.id)', 'count');

    if (photographerId) {
      queryBuilder.where('review.photographerId = :photographerId', { photographerId });
    }

    queryBuilder.groupBy('review.rating');

    const ratingStats = await queryBuilder.getRawMany();

    // 转换为易于使用的格式
    const stats = {
      total: 0,
      average: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };

    let sum = 0;
    ratingStats.forEach(stat => {
      const rating = parseInt(stat.rating);
      const count = parseInt(stat.count);
      stats.distribution[rating] = count;
      stats.total += count;
      sum += rating * count;
    });

    if (stats.total > 0) {
      stats.average = sum / stats.total;
    }

    return stats;
  }

  // 更新摄影师评分
  private async updatePhotographerRating(photographerId: number) {
    // 获取摄影师所有评价
    const reviews = await this.reviewRepository.find({
      where: { photographerId, isPublic: true }
    });

    if (reviews.length > 0) {
      // 计算平均评分
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = sum / reviews.length;

      // 更新摄影师评分
      await this.photographerRepository.update(photographerId, {
        rating: averageRating,
      });
    }
  }

  async getAdminReviews(params: {
    page: number;
    pageSize: number;
    rating?: number;
    productName?: string;
    hasImages?: boolean;
    status?: string;
  }) {
    const query = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.images', 'images');

    if (params.rating) {
      query.andWhere('review.rating = :rating', { rating: params.rating });
    }

    if (params.productName) {
      query.andWhere('product.name LIKE :name', { name: `%${params.productName}%` });
    }

    if (params.hasImages !== undefined) {
      if (params.hasImages) {
        query.andWhere('images.id IS NOT NULL');
      } else {
        query.andWhere('images.id IS NULL');
      }
    }

    if (params.status) {
      query.andWhere('review.status = :status', { status: params.status });
    }

    const [items, total] = await query
      .skip((params.page - 1) * params.pageSize)
      .take(params.pageSize)
      .getManyAndCount();

    return { items, total };
  }

  async getReviewById(id: number, isAdmin: boolean = false) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user', 'images']
    });

    if (!review) {
      throw new NotFoundException('评价不存在');
    }

    return review;
  }

  async replyReview(id: number, replyDto: ReplyReviewDto) {
    const review = await this.getReviewById(id, true);
    review.reply = replyDto.reply;
    review.replyTime = new Date();
    return this.reviewRepository.save(review);
  }

  async deleteReviewByAdmin(id: number) {
    const review = await this.getReviewById(id, true);
    await this.reviewRepository.remove(review);
  }

  async batchReplyReviews(reviewIds: number[], reply: string) {
    const reviews = await this.reviewRepository.findByIds(reviewIds);
    const updatedReviews = reviews.map(review => {
      review.reply = reply;
      review.replyTime = new Date();
      return review;
    });
    
    await this.reviewRepository.save(updatedReviews);
    return reviews.length;
  }

  async setReviewStatus(id: number, status: string, reason?: string) {
    const review = await this.getReviewById(id, true);
    review.status = status;
    review.rejectReason = reason;
    return this.reviewRepository.save(review);
  }

  async getUnrepliedCount() {
    return this.reviewRepository.count({
      where: {
        reply: IsNull()
      }
    });
  }

  async getReviewTags() {
    // 获取所有评价标签及其使用次数
    const tags = await this.reviewRepository
      .createQueryBuilder('review')
      .select('unnest(tags) as tag')
      .addSelect('COUNT(*) as count')
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .getRawMany();
    
    return tags;
  }

  async saveReviewTag(tagData: { name: string; type?: string }) {
    // 实现标签保存逻辑
    return tagData;
  }

  async deleteReviewTag(id: number) {
    // 实现标签删除逻辑
  }

  async exportReviewData(params: any) {
    const reviews = await this.getAdminReviews({
      page: 1,
      pageSize: 1000,
      ...params
    });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Reviews');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '评分', key: 'rating', width: 10 },
      { header: '内容', key: 'content', width: 50 },
      { header: '商品', key: 'product', width: 20 },
      { header: '用户', key: 'user', width: 20 },
      { header: '时间', key: 'createdAt', width: 20 }
    ];

    reviews.items.forEach(review => {
      worksheet.addRow({
        id: review.id,
        rating: review.rating,
        content: review.content,
        product: review.product?.name,
        user: review.user?.username,
        createdAt: review.createdAt
      });
    });

    return workbook.xlsx.writeBuffer();
  }

  async getReviewTrends(startDate: string, endDate: string, photographerId?: number) {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    if (photographerId) {
      queryBuilder.where('review.photographerId = :photographerId', { photographerId });
    }

    queryBuilder
      .andWhere('review.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .select('DATE(review.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(review.rating)', 'avgRating')
      .groupBy('DATE(review.createdAt)')
      .orderBy('DATE(review.createdAt)', 'ASC');

    return queryBuilder.getRawMany();
  }

  async getReviewKeywords(photographerId: number, limit: number = 20) {
    const reviews = await this.reviewRepository.find({
      where: { photographerId },
      select: ['content']
    });

    // 简单的关键词提取实现
    const keywords = {};
    reviews.forEach(review => {
      const words = review.content.split(/\s+/);
      words.forEach(word => {
        if (word.length > 1) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });
    });

    return Object.entries(keywords)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, limit);
  }
}
