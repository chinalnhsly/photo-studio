import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from './booking.entity';

/**
 * 旧版时间段实体
 * 注：此实体用于向后兼容，新代码应使用 BookingSlot
 */
@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '时间段ID' })
  id: number;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column({ default: true })
  @ApiProperty({ description: '是否可用' })
  isAvailable: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '标题或描述' })
  title: string;

  @OneToMany(() => Booking, booking => booking.timeSlot)
  bookings: Booking[];

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
