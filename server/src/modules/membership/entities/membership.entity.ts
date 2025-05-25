import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { MembershipHistory } from './membership-history.entity';

// 添加会员等级枚举
export enum MembershipLevel {
  REGULAR = 'regular',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '会员ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: MembershipLevel,
    enumName: 'membership_level_enum', // 指定 PostgreSQL 枚举类型名称
    default: MembershipLevel.REGULAR
  })
  @ApiProperty({ 
    description: '会员等级', 
    enum: MembershipLevel,
    example: MembershipLevel.REGULAR 
  })
  level: MembershipLevel;

  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '会员积分' })
  points: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @Column({ nullable: true, type: 'date' })
  @ApiProperty({ description: '过期日期' })
  expiryDate: Date;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty({ description: '会员特权' })
  benefits: Record<string, any>;

  @OneToMany(() => MembershipHistory, history => history.membership)
  histories: MembershipHistory[];

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
