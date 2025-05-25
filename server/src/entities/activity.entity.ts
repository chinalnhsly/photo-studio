import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  max_participants: number;
}
