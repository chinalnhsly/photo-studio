import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';
import { PointLogType } from '../enums/point-log-type.enum';

@Entity('member_point_logs')
export class MemberPointLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  points: number;

  @Column({
    type: 'enum',
    enum: PointLogType
  })
  type: PointLogType;

  @Column({ nullable: true })
  description: string;

  @Column()
  balanceBefore: number;

  @Column()
  balanceAfter: number;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @Column({ 
    type: 'timestamptz',
    name: 'earned_time'
  })
  @ApiProperty({ description: '获得时间' })
  earnedTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time',
    nullable: true 
  })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'point_date'
  })
  @ApiProperty({ description: '积分产生日期' })
  pointDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until',
    nullable: true 
  })
  @ApiProperty({ description: '积分有效期' })
  validUntil: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
