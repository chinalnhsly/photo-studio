import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('member_level_logs')
export class MemberLevelLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
}
