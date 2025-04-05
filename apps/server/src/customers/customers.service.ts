import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerFilterDto } from './dto/customer.dto';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { firstName, lastName, ...rest } = createCustomerDto;
    
    // 生成随机密码
    const defaultPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const userData: Prisma.UserCreateInput = {
      name: `${firstName} ${lastName}`,
      email: rest.email,
      phone: rest.phone,
      password: hashedPassword,
      role: Role.USER,
    };

    return this.prisma.user.create({
      data: userData,
    });
  }

  async findAll(filters: CustomerFilterDto) {
    const where: Prisma.UserWhereInput = filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
            { phone: { contains: filters.search } },
          ],
          role: 'USER',
        }
      : { role: 'USER' };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`用户 #${id} 不存在`);
    }

    return user;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        orders: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getCustomerStats(id: number) {
    const user = await this.findOne(id);
    const stats = await this.prisma.order.aggregate({
      where: {
        userId: user.id,
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalAmount = Number(stats._sum.totalAmount || 0);
    const totalOrders = stats._count.id || 0;

    return {
      totalOrders,
      totalSpent: totalAmount,
      averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
    };
  }
}
