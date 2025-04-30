import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';
import { PaymentRecord } from '../../payment/entities/payment-record.entity';

export type OrderStatus = 'pending' | 'paid' | 'scheduled' | 'completed' | 'cancelled';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: '订单编号' })
  orderNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty({ description: '订单总金额' })
  totalAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: '优惠金额' })
  discountAmount: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'scheduled', 'completed', 'cancelled'], default: 'pending' })
  @ApiProperty({ description: '订单状态', enum: ['pending', 'paid', 'scheduled', 'completed', 'cancelled'] })
  status: OrderStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: '支付方式', required: false })
  paymentMethod: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '交易流水号', required: false })
  transactionId: string;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ description: '支付时间', required: false })
  paidAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ description: '预约时间', required: false })
  appointmentDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: '预约时间段ID', required: false })
  timeSlotId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '预约人姓名', required: false })
  customerName: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '预约人电话', required: false })
  customerPhone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '备注', required: false })
  remark: string;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ description: '完成时间', required: false })
  completedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ description: '取消时间', required: false })
  cancelledAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: '取消原因', required: false })
  cancelReason: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '订单过期时间' })
  expireTime: Date;

  @OneToMany(() => PaymentRecord, payment => payment.order)
  payments: PaymentRecord[];

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
