import { 
  Controller, Get, Post, Body, Param, Delete, Put, 
  Query, UseGuards, HttpCode, HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PhotographerService } from './photographer.service';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';
import { CreatePhotographStyleDto } from './dto/create-photograph-style.dto';
import { UpdatePhotographStyleDto } from './dto/update-photograph-style.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('摄影师管理')
@Controller('photographers')
export class PhotographerController {
  constructor(private readonly photographerService: PhotographerService) {}

  // 获取所有摄影师
  @Get()
  @ApiOperation({ summary: '获取所有摄影师列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isActive') isActive?: boolean,
    @Query('specialtyId') specialtyId?: number,
  ) {
    return this.photographerService.findAll({
      page,
      limit,
      isActive,
      specialtyId
    });
  }

  // 获取单个摄影师详情
  @Get(':id')
  @ApiOperation({ summary: '获取摄影师详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  async findOne(@Param('id') id: string) {
    return this.photographerService.findOne(+id);
  }

  // 创建摄影师 (仅管理员)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建摄影师' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createPhotographerDto: CreatePhotographerDto) {
    return this.photographerService.create(createPhotographerDto);
  }

  // 更新摄影师 (仅管理员)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新摄影师信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  async update(
    @Param('id') id: string,
    @Body() updatePhotographerDto: UpdatePhotographerDto,
  ) {
    return this.photographerService.update(+id, updatePhotographerDto);
  }

  // 删除摄影师 (仅管理员)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除摄影师' })
  @ApiResponse({ status: 204, description: '删除成功' })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  async remove(@Param('id') id: string) {
    await this.photographerService.remove(+id);
  }

  // 获取摄影师可用时间段
  @Get(':id/available-slots')
  @ApiOperation({ summary: '获取摄影师可用时间段' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.photographerService.getAvailableSlots(
      +id,
      new Date(startDate),
      new Date(endDate)
    );
  }

  // 获取摄影师工作量统计
  @Get(':id/workload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取摄影师工作量统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getWorkload(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.photographerService.getPhotographerWorkload(
      +id,
      new Date(startDate),
      new Date(endDate)
    );
  }

  // 获取热门摄影师
  @Get('popular/list')
  @ApiOperation({ summary: '获取热门摄影师列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getPopularPhotographers(@Query('limit') limit?: number) {
    return this.photographerService.getPopularPhotographers(limit);
  }

  // --- 摄影风格管理 ---

  // 获取所有摄影风格
  @Get('styles/all')
  @ApiOperation({ summary: '获取所有摄影风格' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getAllStyles() {
    return this.photographerService.findAllStyles();
  }

  // 创建摄影风格 (仅管理员)
  @Post('styles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建摄影风格' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createStyle(@Body() createStyleDto: CreatePhotographStyleDto) {
    return this.photographerService.createStyle(createStyleDto);
  }

  // 更新摄影风格 (仅管理员)
  @Put('styles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新摄影风格' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateStyle(
    @Param('id') id: string,
    @Body() updateStyleDto: UpdatePhotographStyleDto,
  ) {
    return this.photographerService.updateStyle(+id, updateStyleDto);
  }

  // 删除摄影风格 (仅管理员)
  @Delete('styles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除摄影风格' })
  @ApiResponse({ status: 204, description: '删除成功' })
  async removeStyle(@Param('id') id: string) {
    await this.photographerService.removeStyle(+id);
  }
}
