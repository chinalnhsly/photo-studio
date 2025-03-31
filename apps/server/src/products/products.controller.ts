import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('商品管理')
@Controller(['products', 'api/products']) // 支持两种路径
@UseGuards(JwtAuthGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '创建商品' })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      this.logger.debug(`创建商品请求数据: ${JSON.stringify(createProductDto)}`);
      
      // 添加数据验证和类型转换
      const dto = {
        ...createProductDto,
        price: typeof createProductDto.price === 'string' 
          ? parseFloat(createProductDto.price) 
          : createProductDto.price,
        stock: typeof createProductDto.stock === 'string'
          ? parseInt(createProductDto.stock)
          : (createProductDto.stock || 0),
        categoryId: typeof createProductDto.categoryId === 'string' 
          ? parseInt(createProductDto.categoryId) 
          : createProductDto.categoryId
      };
      
      this.logger.debug(`处理后的商品数据: ${JSON.stringify(dto)}`);
      const product = await this.productsService.create(dto);
      
      return {
        success: true,
        data: product,
        message: '商品创建成功'
      };
    } catch (error) {
      this.logger.error(`创建商品失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  async findAll(@Query() query: { categoryId?: string; search?: string }) {
    try {
      this.logger.debug(`获取商品列表, 查询条件: ${JSON.stringify(query)}`);
      const result = await this.productsService.findAll(query);
      
      // 打印返回数据结构，便于调试
      this.logger.debug(`获取到 ${result.items.length} 条商品数据`);
      this.logger.debug(`第一条商品数据: ${result.items[0] ? JSON.stringify(result.items[0]) : '无数据'}`);
      
      // 返回一致的数据结构
      return {
        success: true,
        data: {
          items: result.items,
          total: result.total
        }
      };
    } catch (error) {
      this.logger.error(`获取商品列表失败: ${error.message}`, error.stack);
      throw new BadRequestException('获取商品列表失败');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新商品' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商品' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
