import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { PaymentRecord } from '../../payment/entities/payment-record.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  SCHEDULED = 'scheduled'  // 添加 SCHEDULED 状态
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: '订单编号' })
  orderNumber: string;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ 
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  @ApiProperty({ description: '订单状态', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '订单总金额' })
  totalAmount: number;

  // 添加折扣金额字段
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: '折扣金额' })
  discountAmount: number;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  @ApiProperty({ description: '订单项列表', type: [OrderItem] })
  items: OrderItem[];

  @Column({ nullable: true })
  @ApiProperty({ description: '支付方式' })
  paymentMethod: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '支付ID' })
  paymentId: string;

  // 添加支付关联关系
  @OneToMany(() => PaymentRecord, payment => payment.order)
  payments: PaymentRecord[];

  // 添加支付相关字段
  @Column({ nullable: true, name: 'transaction_id' })
  @ApiProperty({ description: '交易ID' })
  transactionId: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'paid_at' })
  @ApiProperty({ description: '支付时间' })
  paidAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expire_time' })
  @ApiProperty({ description: '支付过期时间' })
  expireTime: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: '配送地址' })
  shippingAddress: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '备注' })
  remark: string;

  // 添加取消相关字段
  @Column({ type: 'timestamptz', nullable: true, name: 'cancelled_at' })
  @ApiProperty({ description: '取消时间' })
  cancelledAt: Date;

  @Column({ nullable: true, name: 'cancel_reason' })
  @ApiProperty({ description: '取消原因' })
  cancelReason: string;

  // 添加完成相关字段
  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  @ApiProperty({ description: '完成时间' })
  completedAt: Date;

  // 添加预约相关字段
  @Column({ type: 'timestamptz', nullable: true, name: 'appointment_date' })
  @ApiProperty({ description: '预约日期' })
  appointmentDate: Date;

  @Column({ nullable: true, name: 'time_slot_id' })
  @ApiProperty({ description: '时间段ID' })
  timeSlotId: string;

  @Column({ nullable: true, name: 'customer_name' })
  @ApiProperty({ description: '客户姓名' })
  customerName: string;

  @Column({ nullable: true, name: 'customer_phone' })
  @ApiProperty({ description: '客户电话' })
  customerPhone: string;

  @Column({ 
    type: 'timestamptz',
    name: 'order_date'
  })
  @ApiProperty({ description: '订单日期' })
  orderDate: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamptz',
    name: 'updated_at'
  })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
