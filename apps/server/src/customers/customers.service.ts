import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerFilterDto } from './dto/customer.dto';
import { PrismaClient, Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const { email, password, firstName, lastName, phone } = createCustomerDto;
      
      const existingCustomer = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { email }
        });

        if (user) {
          throw new ConflictException('该邮箱已被注册');
        }

        return tx.user.create({
          data: {
            email,
            password: await bcrypt.hash(password, 10),
            firstName,
            lastName,
            phone,
            role: 'USER',
          }
        });
      });

      return existingCustomer;
    } catch (error) {
      throw new InternalServerErrorException('创建用户失败');
    }
  }

  async findAll(filters: CustomerFilterDto) {
    const { search, page = 1, pageSize = 10 } = filters;
    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput = {
      role: Role.USER,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true,
            },
          },
          photoTasks: {
            select: {
              id: true,
              taskDate: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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
