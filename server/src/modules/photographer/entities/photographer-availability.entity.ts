import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('photographer_availability')
export class PhotographerAvailability {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '唯一标识符' })
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'date_start'
  })
  @ApiProperty({ description: '可用开始日期' })
  dateStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'date_end'
  })
  @ApiProperty({ description: '可用结束日期' })
  dateEnd: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'block_time',
    nullable: true 
  })
  @ApiProperty({ description: '锁定时间' })
  blockTime: Date;

  @CreateDateColumn({ 
    type: 'timestamptz',
    name: 'created_at'
  })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}
