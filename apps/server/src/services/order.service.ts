import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, items: Array<{ productId: number; quantity: number }>) {
    return await this.prisma.$transaction(async (tx) => {
      // Calculate total amount
      const products = await tx.product.findMany({
        where: { id: { in: items.map(item => item.productId) } }
      });

      const totalAmount = items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price.toNumber() * item.quantity);
      }, 0);

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find(p => p.id === item.productId).price
            }))
          }
        },
        include: {
          orderItems: true
        }
      });

      return order;
    });
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        user: true
      }
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}
