import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Activity } from './activity.entity';

@Entity('activity_registrations')
@Unique(['userId', 'activityId'])
export class ActivityRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  activityId: number;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @CreateDateColumn({ name: 'register_time', type: 'timestamp' })
  registerTime: Date;
}
