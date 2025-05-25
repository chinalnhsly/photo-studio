import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalesStatService } from './sales-stat.service';

@ApiTags('sales-stats')
@Controller('sales-stats')
export class SalesStatController {
  constructor(private readonly salesStatService: SalesStatService) {}

  @Get('trend')
  @ApiOperation({ summary: '获取销售趋势数据' })
  @ApiResponse({ status: 200, description: '销售趋势数据' })
  findTrend(@Query('start') start: string, @Query('end') end: string) {
    return this.salesStatService.findByDateRange(new Date(start), new Date(end));
  }

  @Get('top-products')
  @ApiOperation({ summary: '获取热销商品排行榜' })
  @ApiResponse({ status: 200, description: '热销商品数据' })
  findTopProducts(@Query('limit') limit = 10) {
    return this.salesStatService.findTopProducts(Number(limit));
  }
}
