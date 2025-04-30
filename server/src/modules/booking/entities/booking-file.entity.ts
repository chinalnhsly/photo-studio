import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Booking } from './booking.entity';

export type FileType = 'original' | 'processed' | 'preview' | 'contract' | 'other';

@Entity('booking_files')
export class BookingFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingId: number;

  @ManyToOne(() => Booking, booking => booking.files)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  originalFilename: string;

  @Column({ length: 512 })
  url: string;

  @Column({ length: 100, nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ length: 20, default: 'original' })
  fileType: FileType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
