import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('guest_bookings')
export class GuestBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'preferred_date'
  })
  @ApiProperty({ description: '期望预约日期' })
  preferredDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'contact_time',
    nullable: true 
  })
  @ApiProperty({ description: '联系时间' })
  contactTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'confirm_time',
    nullable: true 
  })
  @ApiProperty({ description: '确认时间' })
  confirmTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
