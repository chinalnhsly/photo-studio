import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewAnalyticsService } from './review-analytics.service';
import { Response } from 'express';

@ApiTags('review-analytics')
@Controller('admin/analytics/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class ReviewAnalyticsController {
  constructor(private readonly analyticsService: ReviewAnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取评价分析概览数据' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiQuery({ name: 'period', description: '周期', required: false, enum: ['day', 'week', 'month'] })
  @ApiResponse({ status: 200, description: '返回评价分析概览数据' })
  async getReviewAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period: string = 'week'
  ) {
    const data = await this.analyticsService.getReviewAnalytics({
      startDate,
      endDate,
      period
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }

  @Get('trend')
  @ApiOperation({ summary: '获取评价趋势数据' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiQuery({ name: 'period', description: '周期', required: false, enum: ['day', 'week', 'month'] })
  @ApiResponse({ status: 200, description: '返回评价趋势数据' })
  async getReviewTrend(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period: string = 'week'
  ) {
    const data = await this.analyticsService.getReviewTrend({
      startDate,
      endDate,
      period
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }

  @Get('top-products')
  @ApiOperation({ summary: '获取评价最多的商品' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiQuery({ name: 'limit', description: '数量限制', required: false })
  @ApiResponse({ status: 200, description: '返回评价最多的商品' })
  async getTopReviewedProducts(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit: number = 10
  ) {
    const data = await this.analyticsService.getTopReviewedProducts({
      startDate,
      endDate,
      limit
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }

  @Get('keywords')
  @ApiOperation({ summary: '获取评价关键词分析' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiQuery({ name: 'limit', description: '数量限制', required: false })
  @ApiResponse({ status: 200, description: '返回评价关键词分析' })
  async getReviewKeywords(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit: number = 50
  ) {
    const data = await this.analyticsService.getReviewKeywords({
      startDate,
      endDate,
      limit
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }

  @Get('export')
  @ApiOperation({ summary: '导出评价分析报告' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiResponse({ status: 200, description: '导出评价分析报告' })
  async exportReviewReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res: Response
  ) {
    const report = await this.analyticsService.generateReviewReport({
      startDate,
      endDate
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=review-analysis-report.xlsx');
    
    return res.send(report);
  }

  @Get('comparison')
  @ApiOperation({ summary: '获取评价数据对比' })
  @ApiQuery({ name: 'previousStartDate', description: '前一周期开始日期', required: true })
  @ApiQuery({ name: 'previousEndDate', description: '前一周期结束日期', required: true })
  @ApiQuery({ name: 'currentStartDate', description: '当前周期开始日期', required: true })
  @ApiQuery({ name: 'currentEndDate', description: '当前周期结束日期', required: true })
  @ApiResponse({ status: 200, description: '返回评价数据对比' })
  async getReviewComparison(
    @Query('previousStartDate') previousStartDate: string,
    @Query('previousEndDate') previousEndDate: string,
    @Query('currentStartDate') currentStartDate: string,
    @Query('currentEndDate') currentEndDate: string
  ) {
    const data = await this.analyticsService.getReviewComparison({
      previousPeriod: {
        startDate: previousStartDate,
        endDate: previousEndDate
      },
      currentPeriod: {
        startDate: currentStartDate,
        endDate: currentEndDate
      }
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }
  
  @Get('sentiment')
  @ApiOperation({ summary: '获取评价情感分析' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiResponse({ status: 200, description: '返回评价情感分析数据' })
  async getSentimentAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const data = await this.analyticsService.getSentimentAnalysis({
      startDate,
      endDate
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }
  
  @Get('user-behavior')
  @ApiOperation({ summary: '获取用户评价行为分析' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiResponse({ status: 200, description: '返回用户评价行为分析' })
  async getUserReviewBehavior(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const data = await this.analyticsService.getUserReviewBehavior({
      startDate,
      endDate
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }
  
  @Get('heatmap')
  @ApiOperation({ summary: '获取评价热力图数据' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiResponse({ status: 200, description: '返回评价热力图数据' })
  async getReviewHeatmap(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const data = await this.analyticsService.getReviewHeatmap({
      startDate,
      endDate
    });
    
    return {
      code: 200,
      message: '获取成功',
      data
    };
  }
}
