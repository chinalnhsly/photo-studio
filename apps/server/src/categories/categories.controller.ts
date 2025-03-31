import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Logger, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建分类' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '分类名称已存在' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      return {
        success: true,
        data: category,
        message: '分类创建成功'
      };
    } catch (error) {
      this.logger.error('创建分类失败:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      success: true,
      data: categories
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分类' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: { name?: string; description?: string },
  ) {
    try {
      this.logger.debug(`更新分类: id=${id}, 数据=${JSON.stringify(updateCategoryDto)}`);
      const category = await this.categoriesService.update(id, updateCategoryDto);
      
      return {
        success: true,
        data: category,
        message: '分类更新成功'
      };
    } catch (error) {
      this.logger.error(`更新分类失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.debug(`删除分类: id=${id}`);
      await this.categoriesService.remove(id);
      
      return {
        success: true,
        message: '分类删除成功'
      };
    } catch (error) {
      this.logger.error(`删除分类失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
