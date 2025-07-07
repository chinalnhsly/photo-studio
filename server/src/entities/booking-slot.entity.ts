import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Photographer } from './photographer.entity';

@Entity('booking_slots')
export class BookingSlot {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '时段ID' })
  id: number;

  @Column({ name: 'photographer_id' })
  @ApiProperty({ description: '摄影师ID' })
  photographerId: number;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographer_id' })
  photographer: Photographer;

  @Column({ type: 'date' })
  @ApiProperty({ description: '日期' })
  date: Date;

  @Column({ name: 'start_time', type: 'time' })
  @ApiProperty({ description: '开始时间' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  @ApiProperty({ description: '结束时间' })
  endTime: string;

  @Column({ name: 'is_available', default: true })
  @ApiProperty({ description: '是否可用', default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '时段标题', required: false })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '描述', required: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
