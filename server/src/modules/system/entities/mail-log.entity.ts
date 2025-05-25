import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'send_time'
  })
  @ApiProperty({ description: '发送时间' })
  sendTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'delivered_time',
    nullable: true 
  })
  @ApiProperty({ description: '投递时间' })
  deliveredTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
