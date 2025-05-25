import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from './member.entity';
import { PointLogType } from '../enums/point-log-type.enum';

@Entity('point_logs')
export class PointLog {
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
    name: 'expire_time',
    nullable: true 
  })
  @ApiProperty({ description: '积分过期时间' })
  expireTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'used_time',
    nullable: true 
  })
  @ApiProperty({ description: '使用时间' })
  usedTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
