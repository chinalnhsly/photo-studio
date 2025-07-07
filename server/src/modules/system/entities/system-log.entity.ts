import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '日志ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'log_time'
  })
  @ApiProperty({ description: '日志时间' })
  logTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
