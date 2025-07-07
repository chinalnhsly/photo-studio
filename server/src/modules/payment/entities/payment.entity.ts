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

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '支付ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '订单ID' })
  orderId: number;

  @Column()
  @ApiProperty({ description: '支付金额' })
  amount: number;

  @Column()
  @ApiProperty({ description: '支付状态' })
  status: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '交易流水号' })
  transactionId: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: '支付时间' })
  paymentTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: '退款时间' })
  refundTime: Date;

  @ManyToOne(() => Order, order => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

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
