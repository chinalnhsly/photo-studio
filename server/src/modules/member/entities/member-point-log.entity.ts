import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Member } from './member.entity';

export type PointChangeType = 'earn' | 'redeem' | 'expire' | 'adjust';

@Entity('member_point_logs')
export class MemberPointLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @ManyToOne(() => Member, member => member.pointLogs)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'varchar', length: 20 })
  type: PointChangeType;

  @Column({ nullable: true })
  orderId: number;

  @Column({ nullable: true })
  bookingId: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  balanceBefore: number;

  @Column({ type: 'int', default: 0 })
  balanceAfter: number;

  @Column({ nullable: true })
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;
}
