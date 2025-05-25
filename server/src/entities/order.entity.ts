import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from '../modules/order/entities/order-item.entity';

export type OrderStatus = 'pending' | 'paid' | 'scheduled' | 'completed' | 'cancelled';

@Entity('orders')
@Index('idx_orders_user', ['user'])
@Index('idx_orders_status', ['status'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ default: 'pending' })
  status: OrderStatus;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  expireTime: Date;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  appointmentDate: Date;

  @Column({ nullable: true })
  timeSlotId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ nullable: true })
  remark: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
