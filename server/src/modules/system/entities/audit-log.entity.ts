import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'operation_time'
  })
  @ApiProperty({ description: '操作时间' })
  operationTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'process_time',
    nullable: true 
  })
  @ApiProperty({ description: '处理时间' })
  processTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
