import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Product } from './entities/product.entity';
import { UserViewHistory } from '../user/entities/user-view-history.entity';
import { Category } from './entities/category.entity';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { Tag } from './entities/tag.entity';

@Injectable()
export class RecommendationService {
  private readonly CACHE_TTL: number;
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(UserViewHistory)
    private readonly userViewHistoryRepository: Repository<UserViewHistory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.CACHE_TTL = this.configService.get<number>('RECOMMENDATION_CACHE_TTL', 3600); // 默认1小时
  }

  /**
   * 获取热门推荐商品
   * @param limit 限制返回数量
   */
  async getHotProducts(limit: number = 10): Promise<Product[]> {
    const cacheKey = `recommendation:hot:${limit}`;
    const cachedData = await this.redisService.get(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // 查询最近一段时间内被浏览/预约最多的商品
    const products = await this.productRepository.createQueryBuilder('product')
      .leftJoin('product.viewHistories', 'viewHistories')
      .leftJoin('product.appointments', 'appointments')
      .where('product.is_active = :isActive', { isActive: true })
      .addSelect('COUNT(viewHistories.id) + COUNT(appointments.id) * 5', 'popularity')
      .groupBy('product.id')
      .orderBy('popularity', 'DESC')
      .limit(limit)
      .getMany();
      
    // 缓存结果
    await this.redisService.set(cacheKey, JSON.stringify(products), this.CACHE_TTL);
    
    return products;
  }

  /**
   * 获取新品推荐
   * @param limit 限制返回数量
   */
  async getNewProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: { 
        isActive: true  // 使用正确的属性名
      },
      order: { 
        createdAt: 'DESC'  // 使用正确的属性名
      },
      take: limit
    });
  }

  /**
   * 根据用户浏览历史进行个性化推荐
   * @param userId 用户ID
   * @param limit 限制返回数量
   */
  async getPersonalizedRecommendations(userId: number, limit: number = 10): Promise<Product[]> {
    // 获取用户浏览历史
    const userHistory = await this.userViewHistoryRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.category'],
      order: { viewedAt: 'DESC' },
      take: 20, // 取最近的20条浏览记录
    });

    if (userHistory.length === 0) {
      // 如果没有浏览历史，返回热门商品
      return this.getHotProducts(limit);
    }

    // 定义一个接口来描述 category 的结构
    interface CategoryType {
      id: number;
      name?: string;
    }

    // 统计用户浏览过的商品类别偏好
    const categoryFrequency = new Map<number, number>();
    
    userHistory.forEach(history => {
      if (history?.product?.category) {
        const category = history.product.category;
        // 使用类型断言和类型守卫
        if (category && typeof category === 'object' && !Array.isArray(category)) {
          const typedCategory = category as CategoryType;
          if ('id' in typedCategory && typeof typedCategory.id === 'number') {
            const categoryId = typedCategory.id;
            const currentCount = categoryFrequency.get(categoryId) || 0;
            categoryFrequency.set(categoryId, currentCount + 1);
          }
        }
      }
    });
    
    // 按频率排序获取用户偏好的类别
    const sortedCategories = [...categoryFrequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // 获取已浏览的商品ID列表
    const viewedProductIds = userHistory
      .filter(history => history.product && history.product.id)
      .map(history => history.product.id);
    
    // 按用户偏好类别推荐未浏览过的商品
    const recommendations: Product[] = [];
    
    for (const categoryId of sortedCategories) {
      if (recommendations.length >= limit) break;
      
      // 确保有有效的商品ID列表再进行查询
      if (viewedProductIds.length > 0) {
        const productsInCategory = await this.productRepository.createQueryBuilder('product')
          .innerJoin('product.category', 'category')
          .where('category.id = :categoryId', { categoryId })
          .andWhere('product.is_active = :isActive', { isActive: true })
          .andWhere('product.id NOT IN (:...viewedProductIds)', { viewedProductIds })
          .orderBy('product.rating', 'DESC')
          .limit(limit - recommendations.length)
          .getMany();
        
        recommendations.push(...productsInCategory);
      } else {
        // 如果没有有效的浏览记录，直接按类别获取商品
        const productsInCategory = await this.productRepository.createQueryBuilder('product')
          .innerJoin('product.category', 'category')
          .where('category.id = :categoryId', { categoryId })
          .andWhere('product.is_active = :isActive', { isActive: true })
          .orderBy('product.rating', 'DESC')
          .limit(limit - recommendations.length)
          .getMany();
        
        recommendations.push(...productsInCategory);
      }
    }
    
    // 如果推荐数量不足，补充热门商品
    if (recommendations.length < limit) {
      const hotProducts = await this.getHotProducts(limit);
      
      for (const product of hotProducts) {
        if (recommendations.length >= limit) break;
        
        if (!viewedProductIds.includes(product.id) && 
            !recommendations.some(p => p.id === product.id)) {
          recommendations.push(product);
        }
      }
    }
    
    return recommendations;
  }

  /**
   * 获取相似商品推荐
   * @param productId 商品ID
   * @param limit 限制返回数量
   */
  async getSimilarProducts(productId: number, limit: number = 6): Promise<Product[]> {
    const cacheKey = `recommendation:similar:${productId}:${limit}`;
    const cachedData = await this.redisService.get(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // 获取当前商品信息并指定类型
    const currentProduct = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'tags'],
    }) as Product & { category: Category };  // 使用类型断言确保 category 存在且类型正确

    if (!currentProduct || !currentProduct.category || typeof currentProduct.category.id !== 'number') {
      return [];
    }

    // 使用类型守卫确保 category.id 存在且为数字
    const categoryId = Number(currentProduct.category.id);
    if (isNaN(categoryId)) {
      return [];
    }

    // 获取同类别且有相同标签的商品
    let query = this.productRepository.createQueryBuilder('product')
      .innerJoin('product.category', 'category')
      .leftJoin('product.tags', 'tags')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('product.id != :productId', { productId })
      .andWhere('product.is_active = :isActive', { isActive: true });
    
    // 只处理 Tag[] 类型，确保 tag 是对象且有 id 属性
    const tagIds: number[] = Array.isArray(currentProduct.tags)
      ? currentProduct.tags
          .filter((tag): tag is Tag => 
            typeof tag === 'object' && tag !== null && 'id' in tag && typeof tag.id === 'number'
          )
          .map(tag => tag.id)
      : [];

    if (tagIds.length > 0) {
      query = query
        .andWhere('tags.id IN (:...tagIds)', { tagIds })
        .addSelect('COUNT(DISTINCT tags.id)', 'tagMatchCount')
        .groupBy('product.id')
        .orderBy('tagMatchCount', 'DESC')
        .addOrderBy('product.rating', 'DESC');
    } else {
      query = query.orderBy('product.rating', 'DESC');
    }
    
    const similarProducts = await query.limit(limit).getMany();
    
    // 缓存结果
    await this.redisService.set(cacheKey, JSON.stringify(similarProducts), this.CACHE_TTL);
    
    return similarProducts;
  }

  /**
   * 按类别获取热门商品
   * @param categoryId 类别ID
   * @param limit 限制返回数量
   */
  async getHotProductsByCategory(categoryId: number, limit: number = 10): Promise<Product[]> {
    const cacheKey = `recommendation:category:${categoryId}:${limit}`;
    const cachedData = await this.redisService.get(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    const products = await this.productRepository.createQueryBuilder('product')
      .innerJoin('product.category', 'category')
      .leftJoin('product.viewHistories', 'viewHistories')
      .where('category.id = :categoryId', { categoryId: Number(categoryId) })
      .andWhere('product.is_active = :isActive', { isActive: true })
      .addSelect('COUNT(viewHistories.id)', 'viewCount')
      .groupBy('product.id')
      .orderBy('viewCount', 'DESC')
      .addOrderBy('product.rating', 'DESC')
      .limit(limit)
      .getMany();
    
    // 缓存结果
    await this.redisService.set(cacheKey, JSON.stringify(products), this.CACHE_TTL);
    
    return products;
  }

  /**
   * 记录用户浏览商品
   * @param userId 用户ID
   * @param productId 商品ID
   */
  async recordUserView(userId: number, productId: number): Promise<void> {
    // 检查是否存在相同记录(24小时内)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const existingRecord = await this.userViewHistoryRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
        viewedAt: MoreThanOrEqual(oneDayAgo),
      },
      relations: ['user', 'product'], // 确保关联关系被加载
    });
    
    if (existingRecord) {
      // 更新现有记录的时间
      existingRecord.viewedAt = new Date();
      await this.userViewHistoryRepository.save(existingRecord);
    } else {
      // 创建新记录
      const viewHistory = this.userViewHistoryRepository.create({
        user: { id: userId },
        product: { id: productId },
        viewedAt: new Date(),
      });
      
      await this.userViewHistoryRepository.save(viewHistory);
    }
    
    // 增加商品的浏览次数
    await this.productRepository.increment({ id: productId }, 'viewCount', 1);
    
    // 清除相关缓存
    await this.redisService.del([
      `recommendation:hot:*`,
      `recommendation:similar:${productId}:*`
    ]);
  }
}
