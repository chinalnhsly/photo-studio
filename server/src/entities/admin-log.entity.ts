import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin_logs')
export class AdminLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  admin_id: number;

  @Column()
  action: string;

  @Column('text')
  detail: string;

  @Column({ nullable: true })
  module: string;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn()
  created_at: Date;
}
