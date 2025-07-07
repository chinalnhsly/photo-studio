import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('shooting_types')
export class ShootingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ 
    type: 'timestamptz',
    name: 'available_from',
    nullable: true 
  })
  @ApiProperty({ description: '可用开始时间' })
  availableFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'available_until',
    nullable: true 
  })
  @ApiProperty({ description: '可用结束时间' })
  availableUntil: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'first_available_date',
    nullable: true 
  })
  @ApiProperty({ description: '首次可用日期' })
  firstAvailableDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'last_available_date',
    nullable: true 
  })
  @ApiProperty({ description: '最后可用日期' })
  lastAvailableDate: Date;

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
