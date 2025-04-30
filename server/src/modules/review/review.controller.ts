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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('评价管理')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: '获取所有评价' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: number,
    @Query('photographerId') photographerId?: number,
    @Query('rating') rating?: number,
    @Query('isPublic') isPublic?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.reviewService.findAll({
      page,
      limit,
      userId,
      photographerId,
      rating,
      isPublic,
      sortBy,
      sortOrder,
    });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户的评价' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findUserReviews(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewService.findByUser(req.user.id, {
      page,
      limit,
    });
  }

  @Get('photographer/:id')
  @ApiOperation({ summary: '获取摄影师的评价' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findPhotographerReviews(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('rating') rating?: number,
  ) {
    return this.reviewService.findByPhotographer(+id, {
      page,
      limit,
      rating,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取评价统计数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getStats(
    @Query('photographerId') photographerId?: number,
  ) {
    return this.reviewService.getReviewStats(photographerId);
  }
  
  @Get('trends')
  @ApiOperation({ summary: '获取评价趋势数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getTrends(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('photographerId') photographerId?: number,
  ) {
    return this.reviewService.getReviewTrends(startDate, endDate, photographerId);
  }
  
  @Get('keywords')
  @ApiOperation({ summary: '获取评价关键词分析' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getKeywords(
    @Query('photographerId') photographerId?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewService.getReviewKeywords(photographerId, limit || 20);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建评价' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    // 使用当前登录用户的ID
    if (!createReviewDto.userId) {
      createReviewDto.userId = req.user.id;
    }
    return this.reviewService.create(createReviewDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评价详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '评价不存在' })
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新评价' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '评价不存在' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Req() req) {
    // 这里可以添加权限检查，确保只有评价的创建者或管理员可以更新评价
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '管理员回复评价' })
  @ApiResponse({ status: 200, description: '回复成功' })
  @ApiResponse({ status: 404, description: '评价不存在' })
  async reply(@Param('id') id: string, @Body() replyDto: ReplyReviewDto) {
    return this.reviewService.reply(+id, replyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除评价' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '评价不存在' })
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
