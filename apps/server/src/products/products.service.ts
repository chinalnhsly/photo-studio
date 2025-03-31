import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // 验证关键字段
      if (!createProductDto.name) {
        throw new BadRequestException('商品名称不能为空');
      }
      
      if (createProductDto.price === undefined || createProductDto.price < 0) {
        throw new BadRequestException('商品价格必须大于或等于0');
      }
      
      if (!createProductDto.categoryId) {
        throw new BadRequestException('必须选择分类');
      }
      
      // 检查分类是否存在
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId }
      });
      
      if (!category) {
        throw new BadRequestException(`ID为${createProductDto.categoryId}的分类不存在`);
      }
      
      // 使用parseInt确保得到整数类型
      const stockValue = parseInt(String(createProductDto.stock || '0'), 10);
      if (isNaN(stockValue) || stockValue < 0) {
        throw new BadRequestException('库存必须是非负整数');
      }
      
      this.logger.debug(`处理后的库存值 (值: ${stockValue}, 类型: ${typeof stockValue})`);
      
      // 使用原始SQL插入商品，完全绕过Prisma的类型检查
      const name = String(createProductDto.name).trim();
      const description = createProductDto.description 
        ? String(createProductDto.description).trim() 
        : null;
      const price = typeof createProductDto.price === 'string'
        ? parseFloat(createProductDto.price)
        : createProductDto.price;
      const categoryId = Number(createProductDto.categoryId);
      const stock = parseInt(String(createProductDto.stock || '0'), 10);
      const isActive = createProductDto.isActive ?? true;
      
      // 记录所有参数，用于调试
      this.logger.debug('创建商品参数:', {
        name, description, price, categoryId, stock, isActive
      });
      
      try {
        // 使用原始SQL查询直接插入数据
        const result = await this.prisma.$queryRaw`
          INSERT INTO "Product" ("name", "description", "price", "categoryId", "stock", "isActive", "createdAt", "updatedAt")
          VALUES (${name}, ${description}, ${price}, ${categoryId}, ${stock}, ${isActive}, NOW(), NOW())
          RETURNING "id", "name", "price", "stock", "description", "categoryId", "isActive", "createdAt", "updatedAt"
        `;
        
        this.logger.debug('SQL查询结果:', result);
        
        // 查询创建的商品，包含分类信息
        const product = await this.prisma.product.findFirst({
          where: { 
            id: (result as any)[0]?.id
          },
          include: {
            category: true
          }
        });
        
        if (!product) {
          throw new Error('无法找到刚创建的商品');
        }
        
        return product;
      } catch (sqlError) {
        this.logger.error(`SQL执行错误: ${sqlError.message}`, sqlError.stack);
        throw new BadRequestException(`SQL错误: ${sqlError.message}`);
      }
    } catch (error) {
      // 详细记录错误信息
      this.logger.error(`创建商品失败: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(`Prisma错误码: ${error.code}`);
        this.logger.error(`Prisma错误详情: ${JSON.stringify(error)}`);
        if (error.code === 'P2002') {
          throw new BadRequestException('商品名称已存在');
        }
      }
      throw error;
    }
  }

  async findAll(query: { categoryId?: string; search?: string }) {
    try {
      const where: Prisma.ProductWhereInput = {
        ...(query.categoryId && { categoryId: parseInt(query.categoryId) }),
        ...(query.search && {
          OR: [
            { 
              name: { 
                contains: query.search, 
                mode: 'insensitive'
              } 
            },
            { 
              description: { 
                contains: query.search, 
                mode: 'insensitive'
              } 
            },
          ],
        }),
      };

      this.logger.debug(`查询条件: ${JSON.stringify(where)}`);

      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: { 
            category: true // 确保每个商品都包含分类信息
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where }),
      ]);

      this.logger.debug(`查询到 ${items.length} 条商品记录`);
      return { items, total };
    } catch (error) {
      this.logger.error(`查询商品列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
