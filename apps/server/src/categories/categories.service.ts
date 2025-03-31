import { Injectable, ConflictException, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      if (!createCategoryDto.name) {
        throw new BadRequestException('分类名称不能为空');
      }

      // 检查数据格式
      this.logger.debug(`接收到创建分类请求: ${JSON.stringify(createCategoryDto)}`);

      // 检查是否存在同名分类
      const existing = await this.prisma.category.findFirst({
        where: { name: createCategoryDto.name.trim() }
      });

      if (existing) {
        throw new ConflictException(`分类 "${createCategoryDto.name}" 已存在`);
      }

      // 创建分类，处理可选字段
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name.trim(),
          // 确保空字符串被转换为 null
          description: createCategoryDto.description?.trim() || null
        }
      });
      
      this.logger.debug(`分类创建成功: ${category.id}`);
      return category;
    } catch (error) {
      // 详细记录错误信息
      this.logger.error(`创建分类失败: ${error.message}`, error.stack);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('分类名称已存在');
        }
      }
      
      // 不泄露具体错误给客户端
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('创建分类失败，请稍后重试');
    }
  }

  async findAll() {
    try {
      return await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { products: true }
          }
        }
      });
    } catch (error) {
      this.logger.error('Failed to fetch categories:', error);
      throw new InternalServerErrorException('获取分类列表失败');
    }
  }

  async update(id: number, data: { name?: string; description?: string }) {
    try {
      // 检查分类是否存在
      const existing = await this.prisma.category.findUnique({
        where: { id }
      });

      if (!existing) {
        throw new NotFoundException(`ID为${id}的分类不存在`);
      }

      // 如果更新名称，检查名称是否已存在
      if (data.name && data.name !== existing.name) {
        const nameExists = await this.prisma.category.findFirst({
          where: {
            name: data.name,
            id: { not: id }
          }
        });

        if (nameExists) {
          throw new ConflictException(`分类名称 "${data.name}" 已存在`);
        }
      }

      // 更新分类
      const updated = await this.prisma.category.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          description: data.description?.trim() || null
        }
      });
      
      this.logger.debug(`分类更新成功: ${JSON.stringify(updated)}`);
      return updated;
    } catch (error) {
      this.logger.error(`更新分类失败: ${error.message}`, error.stack);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('分类名称已存在');
        }
      }
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('更新分类失败');
    }
  }

  async remove(id: number) {
    try {
      // 检查分类是否存在
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } }
      });

      if (!category) {
        throw new NotFoundException(`ID为${id}的分类不存在`);
      }

      // 检查分类是否有关联商品
      if (category._count.products > 0) {
        throw new BadRequestException(`无法删除该分类，有${category._count.products}个商品属于此分类`);
      }

      // 删除分类
      await this.prisma.category.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      this.logger.error(`删除分类失败: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('删除分类失败');
    }
  }
}
