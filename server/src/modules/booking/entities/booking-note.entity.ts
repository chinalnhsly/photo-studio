import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from './booking.entity';
import { User } from '../../user/entities/user.entity';

@Entity('booking_notes')
export class BookingNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @Column()
  userId: number;

  @Column('text')
  content: string;

  @Column({ default: 'internal' })
  type: string;

  @ManyToOne(() => Booking, booking => booking.notes)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ 
    type: 'timestamptz',
    name: 'note_time'
  })
  @ApiProperty({ description: '备注时间' })
  noteTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'follow_up_time',
    nullable: true 
  })
  @ApiProperty({ description: '跟进时间' })
  followUpTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
