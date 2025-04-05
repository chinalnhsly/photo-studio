import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(filters: Partial<ProductFilterDto>) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.categoryId && { categoryId: Number(filters.categoryId) }),
      ...(typeof filters.isActive === 'boolean' && { isActive: filters.isActive }),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + quantity,
        updatedAt: new Date(),
      },
    });
  }
}
