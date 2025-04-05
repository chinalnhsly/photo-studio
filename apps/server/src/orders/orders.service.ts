import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto, OrderFilterDto } from './dto/order.dto';
import { Prisma, OrderStatus, Product } from '@prisma/client';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. 检查并获取商品信息
      const products = await Promise.all(
        createOrderDto.items.map(item =>
          tx.product.findUnique({
            where: { id: item.productId }
          })
        )
      );

      // 验证商品是否都存在
      if (products.some(p => !p)) {
        throw new BadRequestException('部分商品不存在');
      }

      // 2. 计算订单总金额
      const totalAmount = createOrderDto.items.reduce((sum, item, index) => {
        const product = products[index]!;
        return sum + (Number(product.price) * item.quantity);
      }, 0);

      // 3. 创建订单
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          orderItems: {
            create: createOrderDto.items.map((item, index) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products[index]!.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // 4. 更新库存
      await Promise.all(
        createOrderDto.items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return order;
    });
  }

  async findAll(filters: OrderFilterDto) {
    const where: Prisma.OrderWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status }),
    };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`订单 #${id} 不存在`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
