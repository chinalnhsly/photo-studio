import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('refund_records')
export class RefundRecord {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '退款记录ID' })
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '退款金额' })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '退款原因' })
  reason: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '退款状态' })
  status: string;

  @Column({ 
    type: 'timestamptz',
    name: 'request_time'
  })
  @ApiProperty({ description: '申请时间' })
  requestTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'process_time',
    nullable: true 
  })
  @ApiProperty({ description: '处理时间' })
  processTime: Date;

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
