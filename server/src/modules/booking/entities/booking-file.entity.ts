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

@Entity('booking_files')
export class BookingFile {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '文件ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '预约ID' })
  bookingId: number;

  @ManyToOne(() => Booking, booking => booking.files)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column()
  @ApiProperty({ description: '文件名称' })
  fileName: string;

  @Column()
  @ApiProperty({ description: '文件路径' })
  filePath: string;

  @Column()
  @ApiProperty({ description: '文件类型' })
  fileType: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '文件大小（字节）' })
  fileSize: number;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '上传时间' })
  createdAt: Date;
}
