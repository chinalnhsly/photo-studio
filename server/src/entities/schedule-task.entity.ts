import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('schedule_tasks')
export class ScheduleTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cron: string;

  @Column()
  status: string; // active, paused, completed

  @Column('text')
  handler: string; // 任务处理逻辑描述

  @CreateDateColumn()
  created_at: Date;
}
