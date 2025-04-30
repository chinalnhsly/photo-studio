import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Member } from './member.entity';
import { PointLogType } from '../enums/point-log-type.enum';

@Entity('point_logs')
export class PointLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @ManyToOne(() => Member, member => member.pointLogs)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  points: number;

  @Column({
    type: 'enum',
    enum: PointLogType,
    default: PointLogType.OTHER
  })
  type: PointLogType;

  @Column({ nullable: true })
  description: string;

  @Column()
  balanceBefore: number;

  @Column()
  balanceAfter: number;

  @Column({ nullable: true })
  orderId: number;

  @Column({ nullable: true })
  operatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
