import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time'
  })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: true })
  isActiveOnWeekends: boolean;

  @Column({ type: 'int', default: 1 })
  maxBookingsPerSlot: number;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
