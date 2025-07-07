import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('activity_registrations')
@Unique(['user_id', 'activity_id'])
export class ActivityRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  activity_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  register_time: Date;
}
