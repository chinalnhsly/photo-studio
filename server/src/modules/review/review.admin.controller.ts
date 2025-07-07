import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards, Put, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewService } from './review.service';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { BatchReplyDto } from './dto/batch-reply.dto';
import { ReviewStatusDto } from './dto/review-status.dto';
import { Response } from 'express';

@ApiTags('admin-reviews')
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class ReviewAdminController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: '管理员获取评价列表' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'pageSize', description: '每页数量', required: false })
  @ApiQuery({ name: 'rating', description: '评分', required: false })
  @ApiQuery({ name: 'productName', description: '商品名称', required: false })
  @ApiQuery({ name: 'hasImages', description: '是否有图', required: false })
  @ApiQuery({ name: 'status', description: '回复状态', required: false })
  @ApiResponse({ status: 200, description: '返回评价列表' })
  async getReviews(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('rating') rating?: number,
    @Query('productName') productName?: string,
    @Query('hasImages') hasImages?: boolean,
    @Query('status') status?: string
  ) {
    const result = await this.reviewService.getAdminReviews({
      page,
      pageSize,
      rating,
      productName,
      hasImages,
      status
    });
    
    return {
      code: 200,
      message: '获取成功',
      data: result
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '管理员获取评价详情' })
  @ApiParam({ name: 'id', description: '评价ID' })
  @ApiResponse({ status: 200, description: '返回评价详情' })
  async getReviewDetail(@Param('id', ParseIntPipe) id: number) {
    const review = await this.reviewService.getReviewById(id, true);
    return {
      code: 200,
      message: '获取成功',
      data: review
    };
  }

  @Post(':id/reply')
  @ApiOperation({ summary: '管理员回复评价' })
  @ApiParam({ name: 'id', description: '评价ID' })
  @ApiResponse({ status: 200, description: '回复成功' })
  async replyReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyDto: ReplyReviewDto
  ) {
    const review = await this.reviewService.replyReview(id, replyDto);
    return {
      code: 200,
      message: '回复成功',
      data: review
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '管理员删除评价' })
  @ApiParam({ name: 'id', description: '评价ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deleteReview(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.deleteReviewByAdmin(id);
    return {
      code: 200,
      message: '评价已删除'
    };
  }

  @Post('batch-reply')
  @ApiOperation({ summary: '批量回复评价' })
  @ApiResponse({ status: 200, description: '批量回复成功' })
  async batchReplyReviews(@Body() batchReplyDto: BatchReplyDto) {
    const count = await this.reviewService.batchReplyReviews(
      batchReplyDto.reviewIds,
      batchReplyDto.reply
    );
    
    return {
      code: 200,
      message: `成功回复了${count}条评价`,
      data: { count }
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: '设置评价状态（审核）' })
  @ApiParam({ name: 'id', description: '评价ID' })
  @ApiResponse({ status: 200, description: '设置成功' })
  async setReviewStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: ReviewStatusDto
  ) {
    const review = await this.reviewService.setReviewStatus(
      id,
      statusDto.status,
      statusDto.reason
    );
    
    return {
      code: 200,
      message: '设置成功',
      data: review
    };
  }

  @Get('unreplied-count')
  @ApiOperation({ summary: '获取未回复的评价数量' })
  @ApiResponse({ status: 200, description: '返回未回复评价数量' })
  async getUnrepliedCount() {
    const count = await this.reviewService.getUnrepliedCount();
    return {
      code: 200,
      message: '获取成功',
      data: { count }
    };
  }

  @Get('tags')
  @ApiOperation({ summary: '获取评价标签列表' })
  @ApiResponse({ status: 200, description: '返回评价标签列表' })
  async getReviewTags() {
    const tags = await this.reviewService.getReviewTags();
    return {
      code: 200,
      message: '获取成功',
      data: tags
    };
  }

  @Post('tags')
  @ApiOperation({ summary: '创建或更新评价标签' })
  @ApiResponse({ status: 200, description: '创建或更新成功' })
  async saveReviewTag(@Body() tagData: any) {
    const tag = await this.reviewService.saveReviewTag(tagData);
    return {
      code: 200,
      message: tagData.id ? '更新成功' : '创建成功',
      data: tag
    };
  }

  @Delete('tags/:id')
  @ApiOperation({ summary: '删除评价标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deleteReviewTag(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.deleteReviewTag(id);
    return {
      code: 200,
      message: '删除成功'
    };
  }

  @Get('export')
  @ApiOperation({ summary: '导出评价数据' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: false })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: false })
  @ApiQuery({ name: 'rating', description: '评分', required: false })
  @ApiQuery({ name: 'status', description: '状态', required: false })
  @ApiResponse({ status: 200, description: '导出成功' })
  async exportReviewData(
    @Query() params: any,
    @Res() res: Response
  ) {
    const buffer = await this.reviewService.exportReviewData(params);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reviews-export.xlsx');
    
    return res.send(buffer);
  }
}
