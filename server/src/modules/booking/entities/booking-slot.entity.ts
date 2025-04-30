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
import { Photographer } from '../../photographer/entities/photographer.entity';
import { Booking } from './booking.entity';

@Entity('booking_slots')
export class BookingSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photographerId: number;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographerId' })
  photographer: Photographer;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 1 })
  capacity: number;

  @Column({ default: 0 })
  bookedCount: number;

  @OneToMany(() => Booking, booking => booking.slot)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 自定义方法：检查是否已满
  isFull(): boolean {
    return this.bookedCount >= this.capacity;
  }

  // 自定义方法：检查是否可预约
  isBookable(): boolean {
    return this.isAvailable && !this.isFull();
  }

  // 自定义方法：增加预约计数
  incrementBookedCount(): void {
    this.bookedCount += 1;
  }

  // 自定义方法：减少预约计数
  decrementBookedCount(): void {
    if (this.bookedCount > 0) {
      this.bookedCount -= 1;
    }
  }
}
