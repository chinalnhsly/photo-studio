import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '活动ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '活动名称' })
  name: string;

  @Column('text')
  @ApiProperty({ description: '活动描述' })
  description: string;

  @Column({ 
    type: 'timestamptz',  // 修改为 PostgreSQL 支持的时间类型
    name: 'start_date'
  })
  @ApiProperty({ description: '活动开始时间' })
  startDate: Date;

  @Column({ 
    type: 'timestamptz',  // 修改为 PostgreSQL 支持的时间类型
    name: 'end_date'
  })
  @ApiProperty({ description: '活动结束时间' })
  endDate: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_start',
    nullable: true 
  })
  @ApiProperty({ description: '报名开始时间' })
  registrationStart: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'registration_end',
    nullable: true 
  })
  @ApiProperty({ description: '报名结束时间' })
  registrationEnd: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: '活动价格' })
  price: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活' })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '参与人数限制', default: 0 })
  maxParticipants: number;

  @Column({ default: false })
  @ApiProperty({ description: '是否已结束' })
  isEnded: boolean;

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
