import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment_callbacks')
export class PaymentCallback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tradeNo: string;

  @Column()
  transactionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column()
  status: string;

  @Column({ type: 'json', nullable: true })
  rawData: any;

  @Column({ 
    type: 'timestamptz',
    name: 'callback_time'
  })
  @ApiProperty({ description: '回调时间' })
  callbackTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'notify_time'
  })
  @ApiProperty({ description: '通知时间' })
  notifyTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'processed_time',
    nullable: true 
  })
  @ApiProperty({ description: '处理时间' })
  processedTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'handled_time',
    nullable: true 
  })
  @ApiProperty({ description: '处理时间' })
  handledTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'payment_time'
  })
  @ApiProperty({ description: '支付时间' })
  paymentTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'verify_time',
    nullable: true 
  })
  @ApiProperty({ description: '验证时间' })
  verifyTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'complete_time',
    nullable: true 
  })
  @ApiProperty({ description: '完成时间' })
  completeTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
