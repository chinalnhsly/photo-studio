import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('活动营销')
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  // Campaign endpoints
  @Get('campaigns')
  @ApiOperation({ summary: '获取所有活动' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAllCampaigns(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.promotionService.findAllCampaigns({
      page,
      limit,
      status,
      type,
      isActive,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    });
  }

  @Get('campaigns/active')
  @ApiOperation({ summary: '获取所有活跃活动' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findActiveCampaigns() {
    return this.promotionService.findActiveCampaigns();
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: '获取单个活动详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  async findCampaignById(@Param('id') id: string) {
    return this.promotionService.findCampaignById(+id);
  }

  @Post('campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建活动' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.promotionService.createCampaign(createCampaignDto);
  }

  @Patch('campaigns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新活动' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.promotionService.updateCampaign(+id, updateCampaignDto);
  }

  @Delete('campaigns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除活动' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  @ApiResponse({ status: 400, description: '无法删除有活跃优惠券的活动' })
  async deleteCampaign(@Param('id') id: string) {
    return this.promotionService.deleteCampaign(+id);
  }

  @Post('campaigns/:id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '激活活动' })
  @ApiResponse({ status: 200, description: '激活成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  @ApiResponse({ status: 400, description: '活动已经激活' })
  async activateCampaign(@Param('id') id: string) {
    return this.promotionService.activateCampaign(+id);
  }

  @Post('campaigns/:id/pause')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '暂停活动' })
  @ApiResponse({ status: 200, description: '暂停成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  @ApiResponse({ status: 400, description: '只有活跃的活动可以暂停' })
  async pauseCampaign(@Param('id') id: string) {
    return this.promotionService.pauseCampaign(+id);
  }

  @Post('campaigns/:id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '完成活动' })
  @ApiResponse({ status: 200, description: '完成成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  async completeCampaign(@Param('id') id: string) {
    return this.promotionService.completeCampaign(+id);
  }

  @Get('campaigns/:id/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取活动分析数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  async getCampaignAnalytics(@Param('id') id: string) {
    return this.promotionService.getCampaignAnalytics(+id);
  }

  @Post('campaigns/:id/coupons/generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量生成优惠券' })
  @ApiResponse({ status: 201, description: '生成成功' })
  @ApiResponse({ status: 404, description: '活动不存在' })
  async generateBulkCoupons(
    @Param('id') id: string,
    @Body() options: {
      quantity: number;
      type?: string;
      value?: number;
      percentage?: number;
      minimumPurchase?: number;
      startDate?: Date;
      endDate?: Date;
      usageLimit?: number;
      isForNewUser?: boolean;
      isForMember?: boolean;
      memberLevelId?: number;
      productIds?: number[];
      categoryIds?: number[];
    },
  ) {
    const { quantity, ...couponOptions } = options;
    return this.promotionService.generateBulkCoupons(+id, quantity, couponOptions);
  }

  // Coupon endpoints
  @Get('coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有优惠券' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAllCoupons(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: boolean,
    @Query('campaignId') campaignId?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.promotionService.findAllCoupons({
      page,
      limit,
      status,
      type,
      isActive,
      campaignId,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get('coupons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个优惠券详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  async findCouponById(@Param('id') id: string) {
    return this.promotionService.findCouponById(+id);
  }

  @Get('coupons/code/:code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过代码获取优惠券' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  async findCouponByCode(@Param('code') code: string) {
    return this.promotionService.findCouponByCode(code);
  }

  @Post('coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建优惠券' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.promotionService.createCoupon(createCouponDto);
  }

  @Patch('coupons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新优惠券' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  async updateCoupon(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.promotionService.updateCoupon(+id, updateCouponDto);
  }

  @Delete('coupons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除优惠券' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  @ApiResponse({ status: 400, description: '无法删除已使用的优惠券' })
  async deleteCoupon(@Param('id') id: string) {
    return this.promotionService.deleteCoupon(+id);
  }

  @Post('coupons/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '验证优惠券' })
  @ApiResponse({ status: 200, description: '验证成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  @ApiResponse({ status: 400, description: '优惠券无效' })
  async verifyCoupon(
    @Body() body: { code: string; amount: number },
    @Req() req,
  ) {
    return this.promotionService.verifyCoupon(body.code, req.user.id, body.amount);
  }

  @Post('coupons/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '应用优惠券' })
  @ApiResponse({ status: 200, description: '应用成功' })
  @ApiResponse({ status: 404, description: '优惠券不存在' })
  @ApiResponse({ status: 400, description: '优惠券无效' })
  @HttpCode(HttpStatus.OK)
  async applyCoupon(
    @Body() body: { code: string; orderId: number; amount: number },
    @Req() req,
  ) {
    return this.promotionService.applyCoupon(body.code, req.user.id, body.orderId, body.amount);
  }

  @Get('user/coupons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户可用优惠券' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserAvailableCoupons(@Req() req) {
    return this.promotionService.getUserAvailableCoupons(req.user.id);
  }
}
