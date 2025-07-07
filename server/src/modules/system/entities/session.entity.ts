import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time'
  })
  @ApiProperty({ description: '会话开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_active',
    nullable: true 
  })
  @ApiProperty({ description: '最后活跃时间' })
  lastActive: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time'
  })
  @ApiProperty({ description: '会话过期时间' })
  expireTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
