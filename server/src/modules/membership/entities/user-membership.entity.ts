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

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
