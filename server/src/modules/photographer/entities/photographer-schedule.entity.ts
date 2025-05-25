import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('photographer_schedules')
export class PhotographerSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'timestamptz',
    name: 'available_date'
  })
  @ApiProperty({ description: '可约日期' })
  availableDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'block_start',
    nullable: true 
  })
  @ApiProperty({ description: '档期开始时间' })
  blockStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'block_end',
    nullable: true 
  })
  @ApiProperty({ description: '档期结束时间' })
  blockEnd: Date;

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
