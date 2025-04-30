import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('studios')
export class Studio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerHour: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'time', nullable: true })
  openTime: string;

  @Column({ type: 'time', nullable: true })
  closeTime: string;

  @Column({ type: 'simple-json', nullable: true })
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };

  @Column({ default: 60 })
  bufferMinutes: number;

  @OneToMany(() => Booking, booking => booking.studio)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
