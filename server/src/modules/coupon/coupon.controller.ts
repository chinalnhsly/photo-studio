import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CouponService } from './coupon.service';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({ summary: '获取所有优惠券' })
  @ApiResponse({ status: 200, description: '优惠券列表' })
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个优惠券' })
  @ApiResponse({ status: 200, description: '优惠券详情' })
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建优惠券' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() body) {
    return this.couponService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新优惠券' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() body) {
    return this.couponService.update(Number(id), body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除优惠券' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.couponService.remove(Number(id));
  }
}
