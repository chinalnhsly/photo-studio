import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '模板ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '模板代码' })
  code: string;

  @Column()
  @ApiProperty({ description: '模板名称' })
  name: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '模板内容' })
  content: string;

  @Column({ default: 'email' })
  @ApiProperty({ description: '通知类型', enum: ['email', 'sms', 'wechat'] })
  type: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否启用' })
  isActive: boolean;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_from',
    nullable: true 
  })
  @ApiProperty({ description: '生效时间' })
  validFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'valid_until',
    nullable: true 
  })
  @ApiProperty({ description: '失效时间' })
  validUntil: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_used_at',
    nullable: true 
  })
  @ApiProperty({ description: '最后使用时间' })
  lastUsedAt: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamptz',
    name: 'updated_at'
  })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
