import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Voucher } from './voucher.entity';

@Entity('voucher_usages')
export class VoucherUsage {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '使用记录ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '代金券ID' })
  voucherId: number;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => Voucher)
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ 
    type: 'timestamptz',
    name: 'use_time'
  })
  @ApiProperty({ description: '使用时间' })
  useTime: Date;

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
}
