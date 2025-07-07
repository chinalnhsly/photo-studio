import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivityService } from './activity.service';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: '获取所有活动' })
  @ApiResponse({ status: 200, description: '活动列表' })
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个活动' })
  @ApiResponse({ status: 200, description: '活动详情' })
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建活动' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() body) {
    return this.activityService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新活动' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() body) {
    return this.activityService.update(Number(id), body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除活动' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.activityService.remove(Number(id));
  }

  @Post(':id/register')
  @ApiOperation({ summary: '报名活动' })
  @ApiResponse({ status: 200, description: '报名结果' })
  register(@Param('id') id: string, @Body() body: { user_id: number }) {
    return this.activityService.register(Number(id), body.user_id);
  }
}
