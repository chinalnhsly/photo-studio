import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Membership, MembershipLevel } from './membership.entity';

export enum HistoryActionType {
  LEVEL_UP = 'level_up',
  LEVEL_DOWN = 'level_down',
  POINTS_ADDED = 'points_added',
  POINTS_DEDUCTED = 'points_deducted',
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
  EXPIRED = 'expired',
  RENEWED = 'renewed'
}

@Entity('membership_histories')
export class MembershipHistory {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '历史记录ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '会员ID' })
  membershipId: number;

  @ManyToOne(() => Membership)
  @JoinColumn({ name: 'membership_id' })
  membership: Membership;

  @Column({
    type: 'enum',
    enum: HistoryActionType,
    enumName: 'history_action_type_enum'
  })
  @ApiProperty({ 
    description: '操作类型',
    enum: HistoryActionType
  })
  action: HistoryActionType;

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
    enumName: 'membership_level_enum',
    nullable: true
  })
  @ApiProperty({ 
    description: '变更后等级',
    enum: MembershipLevel,
    required: false
  })
  newLevel: MembershipLevel;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '变更前积分' })
  previousPoints: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: '变更后积分' })
  newPoints: number;

  @Column({ nullable: true, name: 'modified_by' })
  @ApiProperty({ description: '操作人' })
  modifiedBy: string;

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
    name: 'change_time',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @ApiProperty({ description: '变更时间' })
  changeTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_from'
  })
  @ApiProperty({ description: '生效时间' })
  effectiveFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'effective_until',
    nullable: true
  })
  @ApiProperty({ description: '失效时间' })
  effectiveUntil: Date;
}
