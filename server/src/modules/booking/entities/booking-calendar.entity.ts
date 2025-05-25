import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('booking_calendars')
export class BookingCalendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'date_start'
  })
  @ApiProperty({ description: '开始日期' })
  dateStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'date_end'
  })
  @ApiProperty({ description: '结束日期' })
  dateEnd: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'update_time',
    nullable: true 
  })
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
