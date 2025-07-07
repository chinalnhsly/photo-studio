import { Injectable, NotFoundException } from '@nestjs/common'; // 添加 NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, IsNull, Not, LessThan, LessThanOrEqual, In } from 'typeorm'; // 添加 In
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';
import * as moment from 'moment';
import * as Excel from 'exceljs';
import { TagCount, ReviewAnalytics } from './interfaces/review-analytics.interface';

@Injectable()
export class ReviewAnalyticsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取评价分析概览数据
   */
  async getReviewAnalytics(params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }): Promise<ReviewAnalytics> {
    // 处理日期范围
    const { startDate, endDate } = this.getDateRange(params);
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取总评价数
    const totalReviews = await this.reviewRepository.count({ where });
    
    // 获取平均评分
    const ratingResult = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where(where)
      .getRawOne();
    
    const averageRating = ratingResult.average ? parseFloat(ratingResult.average) : 0;
    
    // 获取有图评价数
    const withImageReviews = await this.reviewRepository.count({
      where: {
        ...where,
        images: Not(IsNull())
      },
      relations: ['images']
    });
    
    // 获取好评率（4星以上）
    const goodReviews = await this.reviewRepository.count({
      where: {
        ...where,
        rating: MoreThanOrEqual(4)
      }
    });
    
    const satisfactionRate = totalReviews > 0 
      ? (goodReviews / totalReviews) * 100 
      : 0;
    
    // 获取评分分布
    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      const count = await this.reviewRepository.count({
        where: {
          ...where,
          rating: i
        }
      });
      ratingDistribution[i] = count;
    }
    
    // 计算环比增长率
    let reviewsGrowthRate = 0;
    if (startDate && endDate) {
      const currentPeriodDays = moment(endDate).diff(moment(startDate), 'days') + 1;
      const previousStartDate = moment(startDate).subtract(currentPeriodDays, 'days').toDate();
      const previousEndDate = moment(endDate).subtract(currentPeriodDays, 'days').toDate();
      
      const previousReviews = await this.reviewRepository.count({
        where: {
          createdAt: Between(previousStartDate, previousEndDate)
        }
      });
      
      if (previousReviews > 0) {
        reviewsGrowthRate = this.calculateRate(totalReviews - previousReviews, previousReviews);
      } else if (totalReviews > 0) {
        reviewsGrowthRate = 100; // 如果前一个周期没有评价，则增长率为100%
      }
    }
    
    // 统计评价标签出现频率
    const tagFrequency = await this.getTagFrequency(where);
    
    return {
      totalReviews,
      averageRating,
      withImageReviews,
      satisfactionRate,
      ratingDistribution,
      reviewsGrowthRate,
      tagFrequency
    };
  }

  /**
   * 获取评价趋势数据
   */
  async getReviewTrend(params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) {
    // 处理日期范围
    const { startDate, endDate, interval } = this.getDateRangeWithInterval(params);
    
    if (!startDate || !endDate) {
      return [];
    }
    
    // 初始化结果数组
    const result = [];
    
    // 当前日期
    let currentDate = moment(startDate);
    const endMoment = moment(endDate);
    
    // 根据区间创建日期点
    while (currentDate.isSameOrBefore(endMoment)) {
      let nextDate;
      
      // 根据周期计算下一个日期点
      if (interval === 'day') {
        nextDate = currentDate.clone().add(1, 'day');
      } else if (interval === 'week') {
        nextDate = currentDate.clone().add(1, 'week');
      } else if (interval === 'month') {
        nextDate = currentDate.clone().add(1, 'month');
      }
      
      // 确保不超过结束日期
      if (nextDate.isAfter(endMoment)) {
        nextDate = endMoment.clone().add(1, 'day');
      }
      
      // 计算这个区间的评价数量
      const reviewCount = await this.reviewRepository.count({
        where: {
          createdAt: Between(
            currentDate.toDate(),
            nextDate.toDate()
          )
        }
      });
      
      // 计算这个区间的平均评分
      const ratingResult = await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'average')
        .where('review.createdAt BETWEEN :start AND :end', {
          start: currentDate.toDate(),
          end: nextDate.toDate()
        })
        .getRawOne();
      
      const averageRating = ratingResult.average ? parseFloat(ratingResult.average) : 0;
      
      // 计算好评率
      const goodReviews = await this.reviewRepository.count({
        where: {
          createdAt: Between(currentDate.toDate(), nextDate.toDate()),
          rating: MoreThanOrEqual(4)
        }
      });
      
      const satisfactionRate = reviewCount > 0 
        ? (goodReviews / reviewCount) * 100 
        : 0;
      
      // 添加评价数量数据点
      result.push({
        date: currentDate.format('YYYY-MM-DD'),
        type: '评价数量',
        value: reviewCount
      });
      
      // 添加平均评分数据点
      result.push({
        date: currentDate.format('YYYY-MM-DD'),
        type: '平均评分',
        value: averageRating
      });
      
      // 添加好评率数据点
      result.push({
        date: currentDate.format('YYYY-MM-DD'),
        type: '好评率',
        value: satisfactionRate
      });
      
      // 移动到下一个日期点
      currentDate = nextDate;
    }
    
    return result;
  }

  /**
   * 获取评价最多的商品
   */
  async getTopReviewedProducts(params: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    const limit = params.limit || 10;
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取各商品的评价数量和平均评分
    const productStats = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.productId', 'productId')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect('AVG(review.rating)', 'averageRating')
      .addSelect(
        'SUM(CASE WHEN review.rating >= 4 THEN 1 ELSE 0 END)',
        'goodReviews'
      )
      .where(where)
      .groupBy('review.productId')
      .orderBy('reviewCount', 'DESC')
      .limit(limit)
      .getRawMany();
    
    // 获取商品详细信息
    const result = [];
    for (const stat of productStats) {
      const product = await this.productRepository.findOne({
        where: { id: stat.productId }
      });
      
      if (product) {
        // 计算好评率
        const goodRatingPercent = Math.round(
          (parseInt(stat.goodReviews) / parseInt(stat.reviewCount)) * 100
        );
        
        result.push({
          id: product.id,
          product: {
            id: product.id,
            name: product.name,
            images: product.images, // 修复字段名
            price: product.price
          },
          reviewCount: parseInt(stat.reviewCount),
          averageRating: parseFloat(stat.averageRating),
          goodRatingPercent
        });
      }
    }
    
    return result;
  }

  /**
   * 获取评价关键词分析
   */
  async getReviewKeywords(params: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    const limit = params.limit || 50;
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取标签频率
    const tagFrequency = await this.getTagFrequency(where, limit);
    
    return tagFrequency;
  }

  /**
   * 生成评价分析报告
   */
  async generateReviewReport(params: {
    startDate?: string;
    endDate?: string;
  }) {
    // 获取统计数据
    const analytics = await this.getReviewAnalytics(params);
    const topProducts = await this.getTopReviewedProducts({
      ...params,
      limit: 20
    });
    
    // 创建Excel工作簿
    const workbook = new Excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // 添加摘要工作表
    const summarySheet = workbook.addWorksheet('评价概览');
    
    // 设置列
    summarySheet.columns = [
      { header: '指标', key: 'metric', width: 20 },
      { header: '数值', key: 'value', width: 15 }
    ];
    
    // 添加数据
    summarySheet.addRows([
      { metric: '总评价数', value: analytics.totalReviews },
      { metric: '平均评分', value: analytics.averageRating.toFixed(1) },
      { metric: '有图评价数', value: analytics.withImageReviews },
      { metric: '好评率', value: `${analytics.satisfactionRate.toFixed(1)}%` },
      { metric: '环比增长率', value: `${analytics.reviewsGrowthRate.toFixed(1)}%` },
      { metric: '5星评价', value: analytics.ratingDistribution[5] },
      { metric: '4星评价', value: analytics.ratingDistribution[4] },
      { metric: '3星评价', value: analytics.ratingDistribution[3] },
      { metric: '2星评价', value: analytics.ratingDistribution[2] },
      { metric: '1星评价', value: analytics.ratingDistribution[1] }
    ]);
    
    // 添加热门商品工作表
    const topProductsSheet = workbook.addWorksheet('热门商品');
    
    // 设置列
    topProductsSheet.columns = [
      { header: '排名', key: 'rank', width: 10 },
      { header: '商品ID', key: 'id', width: 10 },
      { header: '商品名称', key: 'name', width: 30 },
      { header: '评价数', key: 'reviewCount', width: 10 },
      { header: '平均评分', key: 'averageRating', width: 15 },
      { header: '好评率', key: 'goodRatingPercent', width: 15 }
    ];
    
    // 添加数据
    topProducts.forEach((product, index) => {
      topProductsSheet.addRow({
        rank: index + 1,
        id: product.id,
        name: product.product.name,
        reviewCount: product.reviewCount,
        averageRating: product.averageRating.toFixed(1),
        goodRatingPercent: `${product.goodRatingPercent}%`
      });
    });
    
    // 添加常见标签工作表
    const tagsSheet = workbook.addWorksheet('评价标签');
    
    // 设置列
    tagsSheet.columns = [
      { header: '排名', key: 'rank', width: 10 },
      { header: '标签', key: 'tag', width: 30 },
      { header: '出现次数', key: 'count', width: 15 }
    ];
    
    // 添加数据
    analytics.tagFrequency.forEach((tag, index) => {
      tagsSheet.addRow({
        rank: index + 1,
        tag: tag.tag,
        count: tag.count
      });
    });
    
    // 转换为Buffer
    return await workbook.xlsx.writeBuffer();
  }

  /**
   * 获取评价数据对比
   */
  async getReviewComparison(params: {
    previousPeriod: { startDate: string; endDate: string };
    currentPeriod: { startDate: string; endDate: string };
  }) {
    // 获取两个周期的分析数据
    const previousAnalytics = await this.getReviewAnalytics({
      startDate: params.previousPeriod.startDate,
      endDate: params.previousPeriod.endDate
    });
    
    const currentAnalytics = await this.getReviewAnalytics({
      startDate: params.currentPeriod.startDate,
      endDate: params.currentPeriod.endDate
    });
    
    // 计算增长率
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
    // 构建对比数据
    return {
      totalReviews: {
        previous: previousAnalytics.totalReviews,
        current: currentAnalytics.totalReviews,
        growth: calculateGrowth(
          currentAnalytics.totalReviews,
          previousAnalytics.totalReviews
        )
      },
      averageRating: {
        previous: previousAnalytics.averageRating,
        current: currentAnalytics.averageRating,
        growth: calculateGrowth(
          currentAnalytics.averageRating,
          previousAnalytics.averageRating
        )
      },
      withImageReviews: {
        previous: previousAnalytics.withImageReviews,
        current: currentAnalytics.withImageReviews,
        growth: calculateGrowth(
          currentAnalytics.withImageReviews,
          previousAnalytics.withImageReviews
        )
      },
      satisfactionRate: {
        previous: previousAnalytics.satisfactionRate,
        current: currentAnalytics.satisfactionRate,
        growth: calculateGrowth(
          currentAnalytics.satisfactionRate,
          previousAnalytics.satisfactionRate
        )
      },
      ratingDistribution: {
        previous: previousAnalytics.ratingDistribution,
        current: currentAnalytics.ratingDistribution
      }
    };
  }
  
  /**
   * 转换关键短语为排序后的数组
   */
  private sortPhrases(phrases: Record<string, number>): { phrase: string; count: number }[] {
    return Object.entries(phrases)
      .map(([phrase, count]): { phrase: string; count: number } => ({
        phrase,
        count: Number(count)
      }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 10);
  }

  /**
   * 获取评价情感分析
   */
  async getSentimentAnalysis(params: {
    startDate?: string;
    endDate?: string;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 注意：这里是一个简化的情感分析实现
    // 在实际项目中，你可能会使用NLP服务或更复杂的算法
    
    // 获取评价内容
    const reviews = await this.reviewRepository.find({
      where,
      select: ['id', 'content', 'rating']
    });
    
    // 定义简单的情感词典
    const positiveWords = ['满意', '喜欢', '好', '棒', '赞', '优秀', '完美', '推荐', '专业', '耐心'];
    const negativeWords = ['差', '不满', '失望', '退货', '慢', '难', '贵', '不推荐', '敷衍', '态度差'];

    // 分析结果
    const result = {
      positive: 0,
      neutral: 0,
      negative: 0,
      sentimentScores: [],
      keyPositivePhrases: {},
      keyNegativePhrases: {}
    };
    
    // 对每条评价进行简单的情感分析
    reviews.forEach(review => {
      let positiveScore = 0;
      let negativeScore = 0;
      
      // 基于评分的基础分数
      if (review.rating >= 4) {
        positiveScore += 1;
      } else if (review.rating <= 2) {
        negativeScore += 1;
      }
      
      // 基于关键词的分数调整
      positiveWords.forEach(word => {
        if (review.content.includes(word)) {
          positiveScore += 0.5;
          
          // 统计关键正面短语
          result.keyPositivePhrases[word] = (result.keyPositivePhrases[word] || 0) + 1;
        }
      });
      
      negativeWords.forEach(word => {
        if (review.content.includes(word)) {
          negativeScore += 0.5;
          
          // 统计关键负面短语
          result.keyNegativePhrases[word] = (result.keyNegativePhrases[word] || 0) + 1;
        }
      });
      
      // 计算最终情感得分（正数为正面，负数为负面）
      const finalScore = positiveScore - negativeScore;
      
      // 添加到情感分布统计
      if (finalScore > 0) {
        result.positive += 1;
      } else if (finalScore < 0) {
        result.negative += 1;
      } else {
        result.neutral += 1;
      }
      
      // 记录评价的情感得分
      result.sentimentScores.push({
        id: review.id,
        score: finalScore
      });
    });
    
    // 转换关键短语为排序后的数组
    return {
      totalReviews: reviews.length,
      sentimentDistribution: {
        positive: result.positive,
        neutral: result.neutral,
        negative: result.negative
      },
      positivePercentage: reviews.length > 0 
        ? (result.positive / reviews.length) * 100 
        : 0,
      negativePercentage: reviews.length > 0 
        ? (result.negative / reviews.length) * 100 
        : 0,
      keyPositivePhrases: this.sortPhrases(result.keyPositivePhrases),
      keyNegativePhrases: this.sortPhrases(result.keyNegativePhrases)
    };
  }
  
  /**
   * 获取用户评价行为分析
   */
  async getUserReviewBehavior(params: {
    startDate?: string;
    endDate?: string;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取评价总数
    const totalReviews = await this.reviewRepository.count({ where });
    
    // 获取有图评价数
    const withImageReviews = await this.reviewRepository.count({
      where: {
        ...where,
        images: Not(IsNull())
      },
      relations: ['images']
    });
    
    // 获取匿名评价数
    const anonymousReviews = await this.reviewRepository.count({
      where: {
        ...where,
        isAnonymous: true
      }
    });
    
    // 获取评价字数分布
    const reviews = await this.reviewRepository.find({
      where,
      select: ['content']
    });
    
    // 计算评价长度分布
    const contentLengthDistribution = {
      short: 0,  // 50字以下
      medium: 0, // 50-200字
      long: 0    // 200字以上
    };
    
    reviews.forEach(review => {
      const length = review.content.length;
      if (length < 50) {
        contentLengthDistribution.short += 1;
      } else if (length < 200) {
        contentLengthDistribution.medium += 1;
      } else {
        contentLengthDistribution.long += 1;
      }
    });
    
    // 获取评价时间分布（一天中的时段）
    const timeDistribution = {
      morning: 0,   // 6-12点
      afternoon: 0, // 12-18点
      evening: 0,   // 18-24点
      night: 0      // 0-6点
    };
    
    const reviewsWithTime = await this.reviewRepository.find({
      where,
      select: ['createdAt']
    });
    
    reviewsWithTime.forEach(review => {
      const hour = new Date(review.createdAt).getHours();
      if (hour >= 6 && hour < 12) {
        timeDistribution.morning += 1;
      } else if (hour >= 12 && hour < 18) {
        timeDistribution.afternoon += 1;
      } else if (hour >= 18 && hour < 24) {
        timeDistribution.evening += 1;
      } else {
        timeDistribution.night += 1;
      }
    });
    
    return {
      totalReviews,
      withImagePercentage: totalReviews > 0 
        ? (withImageReviews / totalReviews) * 100 
        : 0,
      anonymousPercentage: totalReviews > 0 
        ? (anonymousReviews / totalReviews) * 100 
        : 0,
      contentLengthDistribution,
      timeDistribution
    };
  }
  
  /**
   * 获取评价热力图数据
   */
  async getReviewHeatmap(params: {
    startDate?: string;
    endDate?: string;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取评价时间数据
    const reviews = await this.reviewRepository.find({
      where,
      select: ['createdAt']
    });
    
    // 生成热力图数据（按星期几和小时分布）
    const heatmapData = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));
    
    reviews.forEach(review => {
      const date = new Date(review.createdAt);
      const day = date.getDay(); // 0-6, 周日到周六
      const hour = date.getHours(); // 0-23
      
      heatmapData[day][hour] += 1;
    });
    
    // 转换为图表所需格式
    const result = [];
    
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        result.push({
          day: days[day],
          hour: `${hour}:00`,
          value: heatmapData[day][hour]
        });
      }
    }
    
    return result;
  }
  
  /**
   * 获取特定评分的典型评价
   */
  async getTypicalReviews(params: {
    startDate?: string;
    endDate?: string;
    count?: number;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    const count = params.count || 3;
    
    // 构建查询条件
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    
    // 获取各评分的典型评价（内容较长、有图的优先）
    const result = {};
    
    for (let rating = 1; rating <= 5; rating++) {
      // 先查找有图且内容长的评价
      const withImagesReviews = await this.reviewRepository.find({
        where: {
          ...where,
          rating,
          images: Not(IsNull())
        },
        relations: ['images', 'user', 'product'],
        order: { 
          createdAt: 'DESC'
        },
        take: count
      });
      
      // 如果找到的评价不足，补充没有图片的评价
      let reviews = [...withImagesReviews];
      
      if (reviews.length < count) {
        const additionalReviews = await this.reviewRepository.find({
          where: {
            ...where,
            rating,
            id: Not(In(reviews.map(r => r.id)))
          },
          relations: ['user', 'product'],
          order: { 
            createdAt: 'DESC'
          },
          take: count - reviews.length
        });
        
        reviews = [...reviews, ...additionalReviews];
      }
      
      // 处理匿名用户
      reviews = reviews.map(review => {
        if (review.isAnonymous && review.user) {
          review.user.username = '匿名用户';
        }
        return review;
      });
      
      result[rating] = reviews;
    }
    
    return result;
  }

  /**
   * 获取商品评价摘要
   */
  async getProductReviewSummary(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: ['id', 'name', 'images', 'price'] // 使用正确的字段名 images
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    // 构建返回数据
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0], // 使用 images 数组的第一张图片
      productPrice: product.price,
      // ...其他统计数据...
    };
  }

  /**
   * 辅助方法：获取日期范围
   */
  private getDateRange(params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) {
    let startDate = null;
    let endDate = null;
    
    // 如果提供了具体日期范围
    if (params.startDate && params.endDate) {
      startDate = new Date(params.startDate);
      endDate = new Date(params.endDate);
      endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
    } else {
      // 根据周期参数确定日期范围
      const period = params.period || 'week';
      
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      if (period === 'day') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'year') {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
      }
    }
    
    return { startDate, endDate };
  }

  /**
   * 辅助方法：获取日期范围和时间间隔
   */
  private getDateRangeWithInterval(params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) {
    const { startDate, endDate } = this.getDateRange(params);
    let interval = 'day';
    
    if (startDate && endDate) {
      const daysDiff = moment(endDate).diff(moment(startDate), 'days');
      if (daysDiff > 90) {
        interval = 'month';
      } else if (daysDiff > 30) {
        interval = 'week';
      } else {
        interval = 'day';
      }
      
      // 覆盖间隔（如果指定了周期）
      if (params.period) {
        interval = params.period;
      }
    }
    
    return { startDate, endDate, interval };
  }

  /**
   * 辅助方法：获取标签使用频率
   */
  private async getTagFrequency(where: any, limit: number = 50): Promise<TagCount[]> {
    // 定义标签统计的接口
    interface TagCount {
      tag: string;
      count: number;
    }

    // 获取包含标签的评价
    const reviewsWithTags = await this.reviewRepository.find({
      where,
      select: ['tags']
    });
    
    // 统计标签出现频率
    const tagCounts: Record<string, number> = {};
    reviewsWithTags.forEach(review => {
      if (review.tags && review.tags.length > 0) {
        review.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // 转换为排序后的数组，添加明确的类型转换
    return Object.entries(tagCounts)
      .map(([tag, count]): TagCount => ({ 
        tag, 
        count: Number(count) 
      }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, limit);
  }

  /**
   * 计算正确率
   */
  private calculateRate(current: number, total: number): number {
    if (total === 0) return 0;
    return (Number(current) / Number(total)) * 100;
  }
}
