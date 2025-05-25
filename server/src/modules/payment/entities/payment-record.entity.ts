import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../order/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash'
}

@Entity('payment_records')
export class PaymentRecord {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '支付记录ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '订单ID' })
  orderId: number;

  @ManyToOne(() => Order, order => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  @ApiProperty({ description: '支付状态', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '支付金额' })
  amount: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '商户订单号' })
  tradeNo: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '交易号' })
  transactionId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '退款单号' })
  refundNo: string;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty({ description: '支付返回数据' })
  paymentData: Record<string, any>;

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
