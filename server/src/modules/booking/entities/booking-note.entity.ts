import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Booking } from './booking.entity';
import { User } from '../../user/entities/user.entity';

@Entity('booking_notes')
export class BookingNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @ManyToOne(() => Booking, booking => booking.notes)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isInternal: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
