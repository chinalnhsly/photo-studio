import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'register_time'
  })
  @ApiProperty({ description: '报名时间' })
  registerTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'check_in_time',
    nullable: true 
  })
  @ApiProperty({ description: '签到时间' })
  checkInTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'cancel_time',
    nullable: true 
  })
  @ApiProperty({ description: '取消时间' })
  cancelTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
