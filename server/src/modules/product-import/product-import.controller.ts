import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductImportService } from './product-import.service';

@ApiTags('product-imports')
@Controller('product-imports')
export class ProductImportController {
  constructor(private readonly productImportService: ProductImportService) {}

  @Get()
  @ApiOperation({ summary: '获取商品批量导入记录列表' })
  @ApiResponse({ status: 200, description: '批量导入记录列表' })
  findAll() {
    return this.productImportService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '创建商品批量导入记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() body) {
    return this.productImportService.createRecord(body);
  }
}
