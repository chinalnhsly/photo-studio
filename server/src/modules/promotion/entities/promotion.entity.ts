import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ 
    type: 'timestamptz',
    name: 'start_date'
  })
  @ApiProperty({ description: '促销开始日期' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_date'
  })
  @ApiProperty({ description: '促销结束日期' })
  endDate: Date;

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
