import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { MemberLevel } from './member-level.entity';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '会员ID' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => MemberLevel)
  @JoinColumn({ name: 'level_id' })
  memberLevel: MemberLevel;

  @Column({ name: 'level_id' })
  levelId: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '积分余额' })
  points: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '累计积分' })
  totalPoints: number;

  @Column({ nullable: true, type: 'date' })
  @ApiProperty({ description: '会员过期日期', required: false })
  expireDate: Date;

  @Column({ nullable: true, type: 'date' })
  @ApiProperty({ description: '生日', required: false })
  birthday: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'start_date'
  })
  @ApiProperty({ description: '会员开始日期' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_date'
  })
  @ApiProperty({ description: '会员结束日期' })
  endDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_renewal_date',
    nullable: true 
  })
  @ApiProperty({ description: '最后续费日期' })
  lastRenewalDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_checkin_time',
    nullable: true 
  })
  @ApiProperty({ description: '最后签到时间' })
  lastCheckinTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'membership_start'
  })
  @ApiProperty({ description: '会员开始时间' })
  membershipStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'membership_end'
  })
  @ApiProperty({ description: '会员结束时间' })
  membershipEnd: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'activation_date'
  })
  @ApiProperty({ description: '激活日期' })
  activationDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expiry_date'
  })
  @ApiProperty({ description: '过期日期' })
  expiryDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_checkin',
    nullable: true 
  })
  @ApiProperty({ description: '最后签到时间' })
  lastCheckin: Date;

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
