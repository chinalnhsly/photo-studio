import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    // 查找商品
    const product = await this.productRepository.findOne({
      where: { id: createOrderDto.productId },
    });
    
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    
    if (product.stock < createOrderDto.quantity) {
      throw new BadRequestException('商品库存不足');
    }
    
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    // 生成订单号
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substr(0, 8)}`;
    
    // 计算总价
    const totalAmount = product.price * createOrderDto.quantity;
    
    // 创建订单
    const order = this.orderRepository.create({
      orderNumber,
      userId,
      totalAmount,
      discountAmount: 0,
      status: 'pending',
      paymentMethod: 'none',
    });
    
    // 保存订单
    const savedOrder = await this.orderRepository.save(order);
    
    // 创建订单项
    const orderItem = this.orderItemRepository.create({
      order: savedOrder,
      productId: product.id,
      quantity: createOrderDto.quantity,
      price: product.price,
      subtotal: totalAmount,
    });
    
    // 保存订单项
    await this.orderItemRepository.save(orderItem);
    
    // 更新商品库存
    product.stock -= createOrderDto.quantity;
    await this.productRepository.save(product);
    
    // 返回包含订单项的订单
    return this.findOne(savedOrder.id, userId);
  }

  async findAll(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product', 'user'],
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items', 'items.product', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    return order;
  }

  async updatePaymentStatus(id: number, payOrderDto: PayOrderDto, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    if (order.status !== 'pending') {
      throw new BadRequestException('订单状态不允许支付');
    }
    
    order.status = 'paid';
    order.paymentMethod = payOrderDto.paymentMethod;
    order.paidAt = new Date();
    
    return this.orderRepository.save(order);
  }

  // 新增方法: createOrder
  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    return this.create(createOrderDto, userId);
  }

  // 新增方法: getUserOrders
  async getUserOrders(userId: number, page = 1, limit = 10, status?: string) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.userId = :userId', { userId });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    const total = await query.getCount();
    const orders = await query
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // 新增方法: getOrderById
  async getOrderById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException(`订单ID ${id} 不存在`);
    }
    
    return order;
  }

  // 新增方法: cancelOrder
  async cancelOrder(id: number, userId: number, reason: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    if (order.status !== 'pending' && order.status !== 'paid') {
      throw new BadRequestException('该状态订单不能取消');
    }
    
    order.status = 'cancelled';
    order.cancelReason = reason;
    order.cancelledAt = new Date();
    
    return this.orderRepository.save(order);
  }

  // 新增方法: updateAppointmentInfo
  async updateAppointmentInfo(id: number, appointmentInfo: any) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    if (order.status !== 'paid') {
      throw new BadRequestException('只有已支付订单可以预约');
    }
    
    Object.assign(order, appointmentInfo);
    order.status = 'scheduled';
    
    return this.orderRepository.save(order);
  }

  // 新增方法: completeOrder
  async completeOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    if (order.status !== 'scheduled' && order.status !== 'paid') {
      throw new BadRequestException('该状态订单不能标记为完成');
    }
    
    order.status = 'completed';
    order.completedAt = new Date();
    
    return this.orderRepository.save(order);
  }

  // 新增方法: getOrderByNumber
  async getOrderByNumber(orderNumber: string) {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items', 'items.product', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException(`订单号 ${orderNumber} 不存在`);
    }
    
    return order;
  }

  // 新增方法: markAsPaid
  async markAsPaid(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    
    if (!order) {
      throw new NotFoundException(`订单ID ${orderId} 不存在`);
    }
    
    if (order.status !== 'pending') {
      throw new BadRequestException('只有待支付订单可以标记为已支付');
    }
    
    order.status = 'paid';
    order.paidAt = new Date();
    
    return this.orderRepository.save(order);
  }
}
