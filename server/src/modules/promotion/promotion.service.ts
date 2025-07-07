import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { Coupon } from './entities/coupon.entity';
import { CouponUsage } from './entities/coupon-usage.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Product } from '../product/entities/product.entity';
import { Category } from '../product/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    
    @InjectRepository(CouponUsage)
    private couponUsageRepository: Repository<CouponUsage>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  // Campaign CRUD Operations
  
  async findAllCampaigns(options: any = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      startDate,
      endDate,
    } = options;
    
    const queryBuilder = this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.products', 'products');
    
    // Apply filters
    if (status) {
      queryBuilder.andWhere('campaign.status = :status', { status });
    }
    
    if (type) {
      queryBuilder.andWhere('campaign.type = :type', { type });
    }
    
    if (isActive !== undefined) {
      queryBuilder.andWhere('campaign.isActive = :isActive', { isActive });
    }
    
    if (search) {
      queryBuilder.andWhere('campaign.name LIKE :search', { search: `%${search}%` });
    }
    
    if (startDate) {
      queryBuilder.andWhere('campaign.startDate >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('campaign.endDate <= :endDate', { endDate });
    }
    
    // Apply sorting
    queryBuilder.orderBy(`campaign.${sortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');
    
    // Apply pagination
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
  
  async findActiveCampaigns() {
    const now = new Date();
    
    return this.campaignRepository.find({
      where: {
        status: 'active',
        isActive: true,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      relations: ['products'],
    });
  }
  
  async findCampaignById(id: number) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['products', 'coupons'],
    });
    
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    
    return campaign;
  }
  
  async createCampaign(createCampaignDto: CreateCampaignDto) {
    const { productIds, ...campaignData } = createCampaignDto;
    
    // Validate products if provided
    let products = [];
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.find({
        where: { id: In(productIds) },
      });
      
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more product IDs are invalid');
      }
    }
    
    // Auto-generate campaign name if not provided
    if (!campaignData.name) {
      campaignData.name = `Campaign ${new Date().toISOString().substring(0, 10)}`;
    }
    
    // Create the campaign
    const campaign = this.campaignRepository.create({
      ...campaignData,
      products,
    });
    
    return this.campaignRepository.save(campaign);
  }
  
  async updateCampaign(id: number, updateCampaignDto: UpdateCampaignDto) {
    const { productIds, ...updateData } = updateCampaignDto;
    
    const campaign = await this.findCampaignById(id);
    
    // Update products if provided
    if (productIds !== undefined) {
      if (productIds.length > 0) {
        const products = await this.productRepository.find({
          where: { id: In(productIds) },
        });
        
        if (products.length !== productIds.length) {
          throw new BadRequestException('One or more product IDs are invalid');
        }
        
        campaign.products = products;
      } else {
        campaign.products = [];
      }
    }
    
    // Update campaign data
    Object.assign(campaign, updateData);
    
    return this.campaignRepository.save(campaign);
  }
  
  async deleteCampaign(id: number) {
    const campaign = await this.findCampaignById(id);
    
    // Check if the campaign has active coupons
    const activeCouponCount = await this.couponRepository.count({
      where: {
        campaignId: id,
        status: 'active',
        isActive: true,
      },
    });
    
    if (activeCouponCount > 0) {
      throw new BadRequestException(`Cannot delete campaign with ${activeCouponCount} active coupons`);
    }
    
    return this.campaignRepository.remove(campaign);
  }
  
  async activateCampaign(id: number) {
    const campaign = await this.findCampaignById(id);
    
    if (campaign.status === 'active') {
      throw new BadRequestException('Campaign is already active');
    }
    
    campaign.status = 'active';
    campaign.isActive = true;
    
    return this.campaignRepository.save(campaign);
  }
  
  async pauseCampaign(id: number) {
    const campaign = await this.findCampaignById(id);
    
    if (campaign.status !== 'active') {
      throw new BadRequestException('Only active campaigns can be paused');
    }
    
    campaign.status = 'paused';
    
    return this.campaignRepository.save(campaign);
  }
  
  async completeCampaign(id: number) {
    const campaign = await this.findCampaignById(id);
    
    campaign.status = 'completed';
    campaign.isActive = false;
    
    return this.campaignRepository.save(campaign);
  }
  
  // Coupon CRUD Operations
  
  async findAllCoupons(options: any = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      isActive,
      search,
      campaignId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = options;
    
    const queryBuilder = this.couponRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.campaign', 'campaign');
    
    // Apply filters
    if (status) {
      queryBuilder.andWhere('coupon.status = :status', { status });
    }
    
    if (type) {
      queryBuilder.andWhere('coupon.type = :type', { type });
    }
    
    if (isActive !== undefined) {
      queryBuilder.andWhere('coupon.isActive = :isActive', { isActive });
    }
    
    if (campaignId) {
      queryBuilder.andWhere('coupon.campaignId = :campaignId', { campaignId });
    }
    
    if (search) {
      queryBuilder.andWhere('(coupon.name LIKE :search OR coupon.code LIKE :search)', { search: `%${search}%` });
    }
    
    // Apply sorting
    queryBuilder.orderBy(`coupon.${sortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');
    
    // Apply pagination
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
  
  async findCouponById(id: number) {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ['campaign', 'products', 'categories', 'users'],
    });
    
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    
    return coupon;
  }
  
  async findCouponByCode(code: string) {
    const coupon = await this.couponRepository.findOne({
      where: { code },
      relations: ['campaign', 'products', 'categories'],
    });
    
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }
    
    return coupon;
  }
  
  async createCoupon(createCouponDto: CreateCouponDto) {
    const { productIds, categoryIds, userIds, ...couponData } = createCouponDto;
    
    // Generate unique code if not provided
    if (!couponData.code) {
      couponData.code = await this.generateUniqueCouponCode();
    } else {
      // Check if code already exists
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: couponData.code },
      });
      
      if (existingCoupon) {
        throw new BadRequestException(`Coupon code ${couponData.code} already exists`);
      }
    }
    
    // Validate campaign if provided
    if (couponData.campaignId) {
      const campaign = await this.campaignRepository.findOne({
        where: { id: couponData.campaignId },
      });
      
      if (!campaign) {
        throw new BadRequestException(`Campaign with ID ${couponData.campaignId} not found`);
      }
    }
    
    // Validate and fetch related entities
    let products = [];
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.find({
        where: { id: In(productIds) },
      });
      
      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more product IDs are invalid');
      }
    }
    
    let categories = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('One or more category IDs are invalid');
      }
    }
    
    let users = [];
    if (userIds && userIds.length > 0) {
      users = await this.userRepository.find({
        where: { id: In(userIds) },
      });
      
      if (users.length !== userIds.length) {
        throw new BadRequestException('One or more user IDs are invalid');
      }
    }
    
    // Create the coupon
    const coupon = this.couponRepository.create({
      ...couponData,
      products,
      categories,
      users,
    });
    
    return this.couponRepository.save(coupon);
  }
  
  async updateCoupon(id: number, updateCouponDto: UpdateCouponDto) {
    const { productIds, categoryIds, userIds, ...updateData } = updateCouponDto;
    
    const coupon = await this.findCouponById(id);
    
    // Check if code is being changed and if it's unique
    if (updateData.code && updateData.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: updateData.code },
      });
      
      if (existingCoupon) {
        throw new BadRequestException(`Coupon code ${updateData.code} already exists`);
      }
    }
    
    // Update products if provided
    if (productIds !== undefined) {
      if (productIds.length > 0) {
        const products = await this.productRepository.find({
          where: { id: In(productIds) },
        });
        
        if (products.length !== productIds.length) {
          throw new BadRequestException('One or more product IDs are invalid');
        }
        
        coupon.products = products;
      } else {
        coupon.products = [];
      }
    }
    
    // Update categories if provided
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.find({
          where: { id: In(categoryIds) },
        });
        
        if (categories.length !== categoryIds.length) {
          throw new BadRequestException('One or more category IDs are invalid');
        }
        
        coupon.categories = categories;
      } else {
        coupon.categories = [];
      }
    }
    
    // Update users if provided
    if (userIds !== undefined) {
      if (userIds.length > 0) {
        const users = await this.userRepository.find({
          where: { id: In(userIds) },
        });
        
        if (users.length !== userIds.length) {
          throw new BadRequestException('One or more user IDs are invalid');
        }
        
        coupon.users = users;
      } else {
        coupon.users = [];
      }
    }
    
    // Update coupon data
    Object.assign(coupon, updateData);
    
    return this.couponRepository.save(coupon);
  }
  
  async deleteCoupon(id: number) {
    const coupon = await this.findCouponById(id);
    
    // Check if the coupon has been used
    const usageCount = await this.couponUsageRepository.count({
      where: { couponId: id },
    });
    
    if (usageCount > 0) {
      throw new BadRequestException(`Cannot delete coupon that has been used ${usageCount} times`);
    }
    
    return this.couponRepository.remove(coupon);
  }
  
  async verifyCoupon(code: string, userId: number, amount: number) {
    const coupon = await this.couponRepository.findOne({
      where: { code, isActive: true },
      relations: ['products', 'categories', 'users'],
    });
    
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }
    
    const now = new Date();
    
    // Check if coupon is active and valid
    if (coupon.status !== 'active') {
      throw new BadRequestException('Coupon is not active');
    }
    
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException('Coupon is not valid at this time');
    }
    
    // Check if coupon has reached usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon has reached its usage limit');
    }
    
    // Check if user has already used this coupon
    const userUsage = await this.couponUsageRepository.count({
      where: { couponId: coupon.id, userId },
    });
    
    if (userUsage > 0) {
      throw new BadRequestException('You have already used this coupon');
    }
    
    // Check if coupon is restricted to specific users
    if (coupon.users && coupon.users.length > 0) {
      const isUserAllowed = coupon.users.some(user => user.id === userId);
      if (!isUserAllowed) {
        throw new BadRequestException('This coupon is not available for your account');
      }
    }
    
    // Check minimum purchase amount
    if (coupon.minimumPurchase && amount < coupon.minimumPurchase) {
      throw new BadRequestException(`Minimum purchase amount of ${coupon.minimumPurchase} required`);
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    
    if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    } else if (coupon.type === 'percentage') {
      discountAmount = amount * coupon.percentage;
    }
    
    // Ensure discount doesn't exceed order amount
    if (discountAmount > amount) {
      discountAmount = amount;
    }
    
    return {
      valid: true,
      coupon,
      discountAmount,
    };
  }
  
  async applyCoupon(code: string, userId: number, orderId: number, amount: number) {
    const verification = await this.verifyCoupon(code, userId, amount);
    
    // Record coupon usage
    const usage = this.couponUsageRepository.create({
      couponId: verification.coupon.id,
      userId,
      orderId,
      discountAmount: verification.discountAmount,
    });
    
    await this.couponUsageRepository.save(usage);
    
    // Update coupon usage count
    verification.coupon.usedCount += 1;
    
    // If the coupon has reached its usage limit, mark it as used
    if (verification.coupon.usageLimit > 0 && verification.coupon.usedCount >= verification.coupon.usageLimit) {
      verification.coupon.status = 'used';
    }
    
    await this.couponRepository.save(verification.coupon);
    
    return {
      success: true,
      discountAmount: verification.discountAmount,
    };
  }
  
  async getUserAvailableCoupons(userId: number) {
    const now = new Date();
    
    // Get all active coupons
    const queryBuilder = this.couponRepository
      .createQueryBuilder('coupon')
      .where('coupon.status = :status', { status: 'active' })
      .andWhere('coupon.isActive = :isActive', { isActive: true })
      .andWhere('coupon.startDate <= :now', { now })
      .andWhere('coupon.endDate >= :now', { now });

    // Check for coupons not yet used by this user
    const userUsages = await this.couponUsageRepository.find({
      where: { userId },
    });
    
    const usedCouponIds = userUsages.map(usage => usage.couponId);
    
    if (usedCouponIds.length > 0) {
      queryBuilder.andWhere('coupon.id NOT IN (:...usedCouponIds)', { usedCouponIds });
    }
    
    // Get coupons available for all users or specifically assigned to this user
    queryBuilder
      .leftJoin('coupon.users', 'users')
      .andWhere('(users.id IS NULL OR users.id = :userId)', { userId });
    
    const coupons = await queryBuilder.getMany();
    
    return coupons;
  }
  
  async generateUniqueCouponCode(length: number = 8): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate random code
      const bytes = randomBytes(length);
      code = Array.from(bytes)
        .map(byte => characters[byte % characters.length])
        .join('');
      
      // Check if code already exists
      const existingCoupon = await this.couponRepository.findOne({
        where: { code },
      });
      
      isUnique = !existingCoupon;
    }
    
    return code;
  }
  
  // Bulk coupon generation
  async generateBulkCoupons(campaignId: number, quantity: number, options: any = {}) {
    const campaign = await this.findCampaignById(campaignId);
    
    const {
      type = 'fixed',
      value = 0,
      percentage = 0,
      minimumPurchase = 0,
      startDate = campaign.startDate || new Date(),
      endDate = campaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      usageLimit = 1,
      isForNewUser = false,
      isForMember = false,
      memberLevelId = null,
      productIds = [],
      categoryIds = [],
    } = options;
    
    const coupons = [];
    
    // Fetch related entities once
    let products = [];
    if (productIds.length > 0) {
      products = await this.productRepository.find({
        where: { id: In(productIds) },
      });
    }
    
    let categories = [];
    if (categoryIds.length > 0) {
      categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
    }
    
    // Generate coupons
    for (let i = 0; i < quantity; i++) {
      const code = await this.generateUniqueCouponCode(10);
      
      const coupon = this.couponRepository.create({
        name: `${campaign.name} Coupon`,
        code,
        campaignId,
        type,
        value: type === 'fixed' ? value : null,
        percentage: type === 'percentage' ? percentage : null,
        minimumPurchase,
        startDate,
        endDate,
        usageLimit,
        isActive: true,
        isForNewUser,
        isForMember,
        memberLevelId,
        status: 'active',
        products,
        categories,
      });
      
      coupons.push(await this.couponRepository.save(coupon));
    }
    
    return coupons;
  }
  
  // Campaign analytics
  async getCampaignAnalytics(campaignId: number) {
    const campaign = await this.findCampaignById(campaignId);
    
    // Get all coupons for this campaign
    const coupons = await this.couponRepository.find({
      where: { campaignId },
    });
    
    const couponIds = coupons.map(coupon => coupon.id);
    
    // Get coupon usages
    const usages = await this.couponUsageRepository.find({
      where: { couponId: In(couponIds) },
      relations: ['user', 'order'],
    });
    
    // Calculate statistics
    const totalCoupons = coupons.length;
    const redeemedCoupons = usages.length;
    const redemptionRate = totalCoupons > 0 ? (redeemedCoupons / totalCoupons) * 100 : 0;
    const totalDiscount = usages.reduce((sum, usage) => sum + Number(usage.discountAmount), 0);
    const averageDiscount = redeemedCoupons > 0 ? totalDiscount / redeemedCoupons : 0;
    
    // Group by coupon
    const couponStats = {};
    for (const usage of usages) {
      if (!couponStats[usage.couponId]) {
        couponStats[usage.couponId] = {
          couponId: usage.couponId,
          code: coupons.find(c => c.id === usage.couponId)?.code,
          usageCount: 0,
          totalDiscount: 0,
        };
      }
      
      couponStats[usage.couponId].usageCount += 1;
      couponStats[usage.couponId].totalDiscount += Number(usage.discountAmount);
    }
    
    return {
      campaign,
      stats: {
        totalCoupons,
        redeemedCoupons,
        redemptionRate,
        totalDiscount,
        averageDiscount,
        couponStats: Object.values(couponStats),
      },
    };
  }
}
