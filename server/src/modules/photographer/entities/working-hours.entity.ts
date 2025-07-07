import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('photographer_working_hours')
export class PhotographerWorkingHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '工作开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time'
  })
  @ApiProperty({ description: '工作结束时间' })
  endTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'break_start',
    nullable: true 
  })
  @ApiProperty({ description: '休息开始时间' })
  breakStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'break_end',
    nullable: true 
  })
  @ApiProperty({ description: '休息结束时间' })
  breakEnd: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
