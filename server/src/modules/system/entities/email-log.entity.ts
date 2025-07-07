import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '日志ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '收件人邮箱' })
  recipient: string;

  @Column()
  @ApiProperty({ description: '邮件主题' })
  subject: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '邮件内容' })
  content: string;

  @Column({ 
    type: 'timestamptz',
    name: 'send_time'
  })
  @ApiProperty({ description: '发送时间' })
  sendTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'delivery_time',
    nullable: true 
  })
  @ApiProperty({ description: '送达时间' })
  deliveryTime: Date;

  @Column({ default: false })
  @ApiProperty({ description: '是否发送成功' })
  success: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '错误信息', required: false })
  errorMessage: string;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
