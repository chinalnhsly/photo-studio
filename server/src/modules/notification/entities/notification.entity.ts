import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '通知ID' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'notify_time'
  })
  @ApiProperty({ description: '通知时间' })
  notifyTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'read_time',
    nullable: true 
  })
  @ApiProperty({ description: '阅读时间' })
  readTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'expire_time',
    nullable: true 
  })
  @ApiProperty({ description: '过期时间' })
  expireTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
