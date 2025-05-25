import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '日志ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '操作类型' })
  type: string;

  @Column()
  @ApiProperty({ description: '操作人ID' })
  operatorId: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '操作描述', required: false })
  description: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({ description: '操作详情', required: false })
  details: Record<string, any>;

  @Column({ 
    type: 'timestamptz',
    name: 'operate_time'
  })
  @ApiProperty({ description: '操作时间' })
  operateTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'complete_time',
    nullable: true 
  })
  @ApiProperty({ description: '完成时间' })
  completeTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
