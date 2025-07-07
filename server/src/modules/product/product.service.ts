import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * 创建新商品
   * @param createProductDto 商品信息
   * @returns 创建的商品
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // 创建产品实体
      const product = this.productRepository.create(createProductDto);
      
      // 保存到数据库
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException(`创建商品失败: ${error.message}`);
    }
  }

  /**
   * 获取商品列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param category 商品分类（可选）
   * @returns 商品列表及分页信息
   */
  async findAll(page = 1, limit = 10, category?: string): Promise<{
    items: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = this.productRepository.createQueryBuilder('product');

    // 添加分类过滤
    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    // 默认只返回激活的商品
    query.andWhere('product.isActive = :isActive', { isActive: true });
    
    // 总数计算
    const total = await query.getCount();

    // 分页查询
    const items = await query
      .orderBy('product.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取单个商品详情
   * @param id 商品ID
   * @returns 商品详情
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`商品ID ${id} 不存在`);
    }

    return product;
  }

  /**
   * 更新商品信息
   * @param id 商品ID
   * @param updateProductDto 更新的商品信息
   * @returns 更新后的商品
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    // 更新商品信息
    Object.assign(product, updateProductDto);
    
    return this.productRepository.save(product);
  }

  /**
   * 删除商品（软删除）
   * @param id 商品ID
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    
    // 软删除 - 设置为非活动
    product.isActive = false; // 修改: is_active -> isActive
    await this.productRepository.save(product);
  }

  /**
   * 按分类获取商品
   * @param category 商品分类
   * @returns 商品列表
   */
  async findByCategory(category: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { category, isActive: true }, // 修改: is_active -> isActive
    });
  }

  /**
   * 搜索商品
   * @param keyword 搜索关键词
   * @returns 符合条件的商品列表
   */
  async search(keyword: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :keyword OR product.description ILIKE :keyword', 
             { keyword: `%${keyword}%` })
      .andWhere('product.isActive = :isActive', { isActive: true }) // 修改: is_active -> isActive
      .orderBy('product.id', 'DESC')
      .getMany();
  }
}
