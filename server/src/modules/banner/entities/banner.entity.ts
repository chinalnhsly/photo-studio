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

  @Column({ default: 0 })
  @ApiProperty({ description: '显示顺序', default: 0 })
  order: number;

  @Column({ default: true })
  @ApiProperty({ description: '是否激活', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '轮播图描述', required: false })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '显示位置(如:home,product)', required: false })
  position: string;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
