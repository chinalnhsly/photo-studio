import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ 
    type: 'timestamptz',
    name: 'payment_time',
    nullable: true 
  })
  @ApiProperty({ description: '支付时间' })
  paymentTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time',
    nullable: true 
  })
  @ApiProperty({ description: '支付过期时间' })
  expireTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'refund_time',
    nullable: true 
  })
  @ApiProperty({ description: '退款时间' })
  refundTime: Date;

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

  // ...其他字段
}
