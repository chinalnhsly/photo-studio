import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Photographer } from '../../photographer/entities/photographer.entity';
import { Studio } from './studio.entity';
import { Product } from '../../product/entities/product.entity';
import { BookingNote } from './booking-note.entity';
import { BookingStatus } from '../enums/booking-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { ShootingType } from '../enums/shooting-type.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  bookingNumber: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  photographerId: number;

  @ManyToOne(() => Photographer)
  @JoinColumn({ name: 'photographerId' })
  photographer: Photographer;

  @Column({ nullable: true })
  studioId: number;

  @ManyToOne(() => Studio)
  @JoinColumn({ name: 'studioId' })
  studio: Studio;

  @Column({
    type: 'enum',
    enum: ShootingType,
    default: ShootingType.STANDARD
  })
  shootingType: ShootingType;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'text', nullable: true })
  customerNote: string;

  @Column({ type: 'int', default: 1 })
  peopleCount: number;

  @Column({ length: 50, nullable: true })
  customerName: string;

  @Column({ length: 20, nullable: true })
  customerPhone: string;

  @Column({ length: 100, nullable: true })
  customerEmail: string;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'booking_products',
    joinColumn: { name: 'bookingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productId', referencedColumnName: 'id' }
  })
  products: Product[];

  @OneToMany(() => BookingNote, note => note.booking)
  notes: BookingNote[];

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paymentAmount: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  depositAmount: number;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ type: 'int', default: 0 })
  reminderCount: number;

  @Column({ nullable: true })
  lastReminderDate: Date;

  @Column({ default: false })
  isRescheduled: boolean;

  @Column({ nullable: true })
  originalBookingId: number;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ default: false })
  isNoShow: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
