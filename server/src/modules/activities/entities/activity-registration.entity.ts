import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activity_registrations')
export class ActivityRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  activity_id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'sign_up_time'
  })
  @ApiProperty({ description: '报名时间' })
  signUpTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'check_in_time',
    nullable: true 
  })
  @ApiProperty({ description: '签到时间' })
  checkInTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
