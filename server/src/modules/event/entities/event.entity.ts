import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_date'
  })
  @ApiProperty({ description: '活动开始日期' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_date'
  })
  @ApiProperty({ description: '活动结束日期' })
  endDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_deadline',
    nullable: true 
  })
  @ApiProperty({ description: '报名截止时间' })
  registrationDeadline: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamptz',
    name: 'updated_at'
  })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
