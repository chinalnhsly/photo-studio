import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { MemberCard } from './member-card.entity';
import { MemberPointLog } from './member-point-log.entity';
import { MemberLevel } from './member-level.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  levelId: number;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastActivityDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'membership_start',
    nullable: true 
  })
  @ApiProperty({ description: '会员开始时间' })
  membershipStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'membership_end',
    nullable: true 
  })
  @ApiProperty({ description: '会员结束时间' })
  membershipEnd: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => MemberLevel)
  @JoinColumn({ name: 'levelId' })
  level: MemberLevel;

  @OneToMany(() => MemberCard, card => card.member)
  cards: MemberCard[];

  @OneToMany(() => MemberPointLog, pointLog => pointLog.member)
  pointLogs: MemberPointLog[];

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
