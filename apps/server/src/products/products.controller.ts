import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { Product } from '@prisma/client';

interface ProductListResponse {
  items: Product[];
  total: number;
}

@ApiTags('商品管理')
@Controller(['products', 'api/products']) // 支持两种路径
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Query() query: Partial<ProductFilterDto>): Promise<{ 
    success: boolean; 
    data: ProductListResponse;
  }> {
    try {
      this.logger.debug(`获取商品列表, 查询条件: ${JSON.stringify(query)}`);
      const result = await this.productsService.findAll(query);
      
      this.logger.debug(`获取到 ${result.items.length} 条商品数据`);
      if (result.items.length > 0) {
        this.logger.debug(`第一条商品数据: ${JSON.stringify(result.items[0])}`);
      } else {
        this.logger.debug('无商品数据');
      }
      
      return {
        success: true,
        data: result
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

  @Patch(':id/stock')
  @ApiOperation({ summary: '更新商品库存' })
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(+id, quantity);
  }
}
