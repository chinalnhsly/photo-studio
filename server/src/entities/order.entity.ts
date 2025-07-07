import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from '../modules/order/entities/order-item.entity';

export type OrderStatus = 'pending' | 'paid' | 'scheduled' | 'completed' | 'cancelled' | 'refunded';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { name: 'total_amount', precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { name: 'discount_amount', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ default: 'pending' })
  status: OrderStatus;

  @Column({ name: 'payment_method', default: 'none' })
  paymentMethod: string;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'expire_time', type: 'timestamp', nullable: true })
  expireTime: Date;

  @Column({ name: 'appointment_date', type: 'timestamp', nullable: true })
  appointmentDate: Date;

  @Column({ name: 'time_slot_id', nullable: true })
  timeSlotId: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ name: 'customer_phone', nullable: true })
  customerPhone: string;

  @Column({ name: 'remark', nullable: true })
  remark: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancel_reason', nullable: true })
  cancelReason: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
