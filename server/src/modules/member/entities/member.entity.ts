import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { MemberLevel } from './member-level.entity';
import { PointLog } from './point-log.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  levelId: number;

  @ManyToOne(() => MemberLevel, { nullable: true })
  @JoinColumn({ name: 'level_id' })
  level: MemberLevel;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
  totalSpent: number;

  @Column({ default: 0 })
  orderCount: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'date' })
  birthday: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSubscribed: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true, type: 'date' })
  lastPurchaseDate: Date;

  @Column({ nullable: true, type: 'date' })
  lastActivityDate: Date;

  @OneToMany(() => PointLog, pointLog => pointLog.member)
  pointLogs: PointLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
