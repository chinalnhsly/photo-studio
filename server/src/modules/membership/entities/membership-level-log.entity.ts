import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MembershipLevel } from './membership.entity';
import { User } from '../../user/entities/user.entity';

/**
 * 会员等级变更日志实体
 */
@Entity('membership_level_logs')
export class MembershipLevelLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '日志ID' })
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
    enumName: 'membership_level_enum',
    nullable: true
  })
  @ApiProperty({ 
    description: '变更前等级',
    enum: MembershipLevel,
    required: false
  })
  previousLevel: MembershipLevel;

  @Column({
    type: 'enum',
    enum: MembershipLevel,
    enumName: 'membership_level_enum'
  })
  @ApiProperty({ 
    description: '变更后等级',
    enum: MembershipLevel
  })
  currentLevel: MembershipLevel;

  @Column({ nullable: true })
  @ApiProperty({ description: '变更原因' })
  reason: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '操作人' })
  operatedBy: string;

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty({ description: '附加数据' })
  metadata: Record<string, any>;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_date',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @ApiProperty({ description: '生效日期' })
  effectiveDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expiry_date',
    nullable: true
  })
  @ApiProperty({ description: '过期日期' })
  expiryDate: Date;
}
