import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('member_checkins')
export class MemberCheckin {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'checkin_time'
  })
  @ApiProperty({ description: '签到时间' })
  checkinTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'next_available_time'
  })
  @ApiProperty({ description: '下次可签到时间' })
  nextAvailableTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
