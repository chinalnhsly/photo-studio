import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from './coupon.entity';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('coupon_usages')
export class CouponUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponId: number;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ 
    type: 'timestamptz',
    name: 'use_time'
  })
  @ApiProperty({ description: '使用时间' })
  useTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time',
    nullable: true 
  })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
