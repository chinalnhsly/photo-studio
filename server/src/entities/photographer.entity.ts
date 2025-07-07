import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from './booking.entity';
import { BookingSlot } from './booking-slot.entity';

@Entity('photographers')
export class Photographer {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '摄影师ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '姓名' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '头像', required: false })
  avatar: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '简介', required: false })
  bio: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: '详细介绍', required: false })
  biography: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '摄影风格', required: false })
  style: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '工作经验年限', required: false })
  experience: string;

  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 1 })
  @ApiProperty({ description: '评分', required: false })
  rating: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '联系电话', required: false })
  phone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '邮箱', required: false })
  email: string;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({ description: '是否启用', default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'simple-array' })
  @ApiProperty({ description: '专长领域', required: false })
  specialties: string[];

  @Column({ name: 'portfolio_images', nullable: true, type: 'simple-array' })
  @ApiProperty({ description: '作品集', required: false })
  portfolioImages: string[];

  @Column({ nullable: true, type: 'jsonb' })
  @ApiProperty({ description: '设备信息', required: false })
  equipments: Record<string, any>;

  @Column({ name: 'languages_spoken', nullable: true, type: 'simple-array' })
  @ApiProperty({ description: '语言能力', required: false })
  languagesSpoken: string[];

  @Column({ name: 'accepts_rush_jobs', default: false })
  @ApiProperty({ description: '是否接受加急预约', default: false })
  acceptsRushJobs: boolean;

  @OneToMany(() => Booking, booking => booking.photographer)
  bookings: Booking[];

  @OneToMany(() => BookingSlot, slot => slot.photographer)
  slots: BookingSlot[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
