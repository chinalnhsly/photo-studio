import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Patch,
  Delete,
  ParseIntPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('商品')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '创建新商品' })
  @ApiResponse({ status: 201, description: '商品创建成功' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiResponse({ status: 200, description: '返回商品列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10,
    @Query('category') category?: string,
  ) {
    return this.productService.findAll(+page, +limit, category);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索商品' })
  @ApiResponse({ status: 200, description: '返回搜索结果' })
  @ApiQuery({ name: 'keyword', required: true, type: String })
  async search(@Query('keyword') keyword: string) {
    return this.productService.search(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个商品详情' })
  @ApiResponse({ status: 200, description: '返回单个商品详情' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '更新商品信息' })
  @ApiResponse({ status: 200, description: '商品更新成功' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '删除商品' })
  @ApiResponse({ status: 200, description: '商品删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
    return { message: '商品删除成功' };
  }
}
