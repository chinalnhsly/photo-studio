import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Photographer } from '../../photographer/entities/photographer.entity';
import { Booking } from './booking.entity';

@Entity('booking_slots')
export class BookingSlot {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '时段ID' })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '摄影师ID' })
  photographerId: number;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographer_id' })
  photographer: Photographer;

  @Column({ type: 'date' })
  @ApiProperty({ description: '预约日期', example: '2023-05-01' })
  date: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @Column({ default: true })
  @ApiProperty({ description: '是否可用' })
  isAvailable: boolean;

  @OneToMany(() => Booking, booking => booking.slot)
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
