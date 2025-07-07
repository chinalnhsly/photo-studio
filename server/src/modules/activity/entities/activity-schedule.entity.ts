import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activity_schedules')
export class ActivitySchedule {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '活动计划ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'schedule_date'
  })
  @ApiProperty({ description: '活动日期' })
  scheduleDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time'
  })
  @ApiProperty({ description: '结束时间' })
  endTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
