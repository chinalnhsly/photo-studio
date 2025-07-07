import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from './booking.entity';

@Entity('booking_files')
export class BookingFile {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '文件ID' })
  id: number;

  @Column({ name: 'booking_id' })
  @ApiProperty({ description: '预约ID' })
  bookingId: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ name: 'file_name' })
  @ApiProperty({ description: '文件名称' })
  fileName: string;

  @Column({ name: 'file_path' })
  @ApiProperty({ description: '文件路径' })
  filePath: string;

  @Column({ name: 'file_type' })
  @ApiProperty({ description: '文件类型' })
  fileType: string;

  @Column({ name: 'file_size' })
  @ApiProperty({ description: '文件大小(字节)' })
  fileSize: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
