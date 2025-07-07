import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '轮播图ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '轮播图标题' })
  title: string;

  @Column()
  @ApiProperty({ description: '图片URL' })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '链接地址', required: false })
  linkUrl: string;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '显示顺序', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '位置', required: false })
  position: string;

  @Column({ 
    type: 'timestamptz',
    name: 'start_time',
    nullable: true 
  })
  @ApiProperty({ description: '展示开始时间' })
  startTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'end_time',
    nullable: true 
  })
  @ApiProperty({ description: '展示结束时间' })
  endTime: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'display_from',
    nullable: true 
  })
  @ApiProperty({ description: '展示开始时间' })
  displayFrom: Date;

  @Column({ 
    type: 'timestamptz',
    name: 'display_until',
    nullable: true 
  })
  @ApiProperty({ description: '展示结束时间' })
  displayUntil: Date;

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
