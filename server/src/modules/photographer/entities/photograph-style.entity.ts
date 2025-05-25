import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('photograph_styles')
export class PhotographStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ 
    type: 'timestamptz',
    name: 'active_from',
    nullable: true 
  })
  @ApiProperty({ description: '风格生效时间' })
  activeFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'active_until',
    nullable: true 
  })
  @ApiProperty({ description: '风格失效时间' })
  activeUntil: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'start_from',
    nullable: true 
  })
  @ApiProperty({ description: '开始提供时间' })
  startFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_until',
    nullable: true 
  })
  @ApiProperty({ description: '停止提供时间' })
  endUntil: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_used',
    nullable: true 
  })
  @ApiProperty({ description: '最后使用时间' })
  lastUsed: Date;

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
