import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiResponse({ status: 200, description: '商品列表' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.productService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  @ApiResponse({ status: 200, description: '商品详情' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }
}
