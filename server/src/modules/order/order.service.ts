import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private connection: Connection,
  ) {}

  /**
   * 创建订单
   * @param createOrderDto 创建订单DTO
   * @param userId 用户ID
   */
  async createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    // 生成订单号
    const orderNumber = this.generateOrderNumber();
    
    // 开启事务
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // 验证商品信息
      const products = await this.validateProducts(createOrderDto.items);
      
      // 计算订单金额
      let totalAmount = 0;
      for (const item of createOrderDto.items) {
        const product = products.find(p => p.id === item.productId);
        totalAmount += product.price * item.quantity;
      }
      
      // 创建订单
      const order = new Order();
      order.orderNumber = orderNumber;
      order.userId = userId;
      order.totalAmount = totalAmount;
      order.discountAmount = 0; // 暂不考虑优惠
      order.status = OrderStatus.PENDING; // 使用枚举值
      order.expireTime = moment().add(30, 'minutes').toDate(); // 30分钟内支付
      
      // 保存订单
      const savedOrder = await queryRunner.manager.save(Order, order);
      
      // 创建并保存订单项
      await this.createOrderItems(savedOrder, products, createOrderDto.items);
      
      // 减库存
      for (const item of createOrderDto.items) {
        await queryRunner.manager.decrement(
          Product,
          { id: item.productId },
          'stock',
          item.quantity
        );
      }
      
      // 提交事务
      await queryRunner.commitTransaction();
      
      // 查询完整订单（包含订单项）
      return this.getOrderById(savedOrder.id);
      
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放资源
      await queryRunner.release();
    }
  }

  /**
   * 根据ID获取订单详情
   * @param id 订单ID
   */
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items']
    });
    
    if (!order) {
      throw new NotFoundException(`订单ID为${id}的订单不存在`);
    }
    
    return order;
  }

  /**
   * 根据订单号获取订单详情
   * @param orderNumber 订单号
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items']
    });
    
    if (!order) {
      throw new NotFoundException(`订单号为${orderNumber}的订单不存在`);
    }
    
    return order;
  }

  /**
   * 获取用户订单列表
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @param status 订单状态
   */
  async getUserOrders(
    userId: number,
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus
  ): Promise<{ orders: Order[], total: number }> {
    // 构建查询条件
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC');
    
    // 筛选订单状态
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }
    
    // 分页查询
    const total = await queryBuilder.getCount();
    const orders = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    
    return { orders, total };
  }

  /**
   * 取消订单
   * @param id 订单ID
   * @param userId 用户ID (用于验证权限)
   * @param reason 取消原因
   */
  async cancelOrder(id: number, userId: number, reason: string): Promise<Order> {
    const order = await this.getOrderById(id);
    
    // 验证用户权限
    if (order.userId !== userId) {
      throw new BadRequestException('无权操作此订单');
    }
    
    // 检查订单状态
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException('只有待支付状态的订单才能取消');
    }
    
    // 开启事务
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // 更新订单状态
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();
      order.cancelReason = reason;
      
      await queryRunner.manager.save(Order, order);
      
      // 恢复库存
      for (const item of order.items) {
        await queryRunner.manager.increment(
          Product,
          { id: item.productId },
          'stock',
          item.quantity
        );
      }
      
      // 提交事务
      await queryRunner.commitTransaction();
      
      return order;
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放资源
      await queryRunner.release();
    }
  }

  /**
   * 更新订单支付状态
   * @param orderNumber 订单号
   * @param paymentInfo 支付信息
   */
  async updateOrderPaymentStatus(
    orderNumber: string,
    paymentInfo: {
      paymentMethod: string;
      transactionId: string;
      paidAmount: number;
    }
  ): Promise<Order> {
    const order = await this.getOrderByNumber(orderNumber);
    
    // 检查订单状态
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException('订单状态不是待支付');
    }
    
    // 检查支付金额
    if (paymentInfo.paidAmount !== order.totalAmount) {
      throw new BadRequestException('支付金额与订单金额不符');
    }
    
    // 更新订单状态
    order.status = OrderStatus.PAID;
    order.paymentMethod = paymentInfo.paymentMethod;
    order.transactionId = paymentInfo.transactionId;
    order.paidAt = new Date();
    
    return this.orderRepository.save(order);
  }

  /**
   * 更新预约信息
   * @param id 订单ID
   * @param appointmentInfo 预约信息
   */
  async updateAppointmentInfo(
    id: number,
    appointmentInfo: {
      appointmentDate: Date;
      timeSlotId: string;
      customerName: string;
      customerPhone: string;
      remark?: string;
    }
  ): Promise<Order> {
    const order = await this.getOrderById(id);
    
    // 检查订单状态
    if (order.status !== OrderStatus.PAID) {
      throw new ConflictException('只有已支付的订单才能更新预约信息');
    }
    
    // 更新预约信息
    order.appointmentDate = appointmentInfo.appointmentDate;
    order.timeSlotId = appointmentInfo.timeSlotId;
    order.customerName = appointmentInfo.customerName;
    order.customerPhone = appointmentInfo.customerPhone;
    order.remark = appointmentInfo.remark;
    order.status = OrderStatus.SCHEDULED;
    
    return this.orderRepository.save(order);
  }

  /**
   * 完成订单
   * @param id 订单ID
   */
  async completeOrder(id: number): Promise<Order> {
    const order = await this.getOrderById(id);
    
    // 检查订单状态
    if (order.status !== OrderStatus.SCHEDULED) {
      throw new ConflictException('只有已预约的订单才能标记为完成');
    }
    
    // 更新订单状态
    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    
    return this.orderRepository.save(order);
  }

  /**
   * 生成订单号 - 格式: 年月日 + 8位随机字符串
   */
  private generateOrderNumber(): string {
    const datePart = moment().format('YYYYMMDD');
    const randomPart = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `${datePart}${randomPart}`;
  }

  /**
   * 清理过期未支付订单
   * 注意：此方法应当通过定时任务调用
   */
  async cleanExpiredOrders(): Promise<number> {
    const now = new Date();
    
    // 查找过期未支付订单
    const expiredOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PENDING,
        expireTime: In([now]), // 修正为数组
      },
      relations: ['items']
    });
    
    if (expiredOrders.length === 0) {
      return 0;
    }
    
    // 开启事务
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const order of expiredOrders) {
        // 更新订单状态
        order.status = OrderStatus.CANCELLED;
        order.cancelledAt = now;
        order.cancelReason = '订单支付超时自动取消';
        
        await queryRunner.manager.save(Order, order);
        
        // 恢复库存
        for (const item of order.items) {
          await queryRunner.manager.increment(
            Product,
            { id: item.productId },
            'stock',
            item.quantity
          );
        }
      }
      
      // 提交事务
      await queryRunner.commitTransaction();
      
      return expiredOrders.length;
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放资源
      await queryRunner.release();
    }
  }

  async create(productId: number, quantity: number) {
    // TODO: 创建订单逻辑
    return { orderId: 1, status: 'pending' };
  }

  async pay(orderId: number, paymentMethod: string) {
    // TODO: 支付逻辑
    return { orderId, status: 'paid', paymentMethod };
  }

  /**
   * 标记订单为已支付
   * @param orderId 订单ID
   */
  async markAsPaid(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException(`订单ID ${orderId} 不存在`);
    }

    order.status = OrderStatus.PAID;
    order.paidAt = new Date();
    return this.orderRepository.save(order);
  }

  private async validateProducts(items: Array<{ productId: number; quantity: number }>) {
    const products = await this.productRepository.findBy({ 
      id: In(items.map(item => item.productId)) 
    });
      
    // 检查商品是否存在
    if (products.length !== items.length) {
      throw new BadRequestException('部分商品不存在');
    }
      
    // 商品库存和状态检查
    for (const product of products) {
      const item = items.find(i => i.productId === product.id);
      if (!product.isActive) {  // 修正字段名
        throw new BadRequestException(`商品 ${product.name} 已下架`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`商品 ${product.name} 库存不足`);
      }
    }

    return products;
  }

  private async createOrderItems(order: Order, products: Product[], items: Array<{ productId: number; quantity: number }>) {
    const orderItems: Partial<OrderItem>[] = [];
    
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      const subtotal = product.price * item.quantity;
      
      orderItems.push({
        orderId: order.id,
        productId: product.id,
        name: product.name,
        images: product.images,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });
    }

    return this.orderItemRepository.save(orderItems);
  }
}
