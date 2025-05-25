import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('photographers')
export class Photographer {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '摄影师ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '摄影师名称' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '头像' })
  avatar: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: '简介' })
  bio: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: '个人传记' })
  biography: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '擅长风格' })
  style: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '工作经验（年）' })
  experience: number;

  @ApiProperty({ description: '工作年限' })
  get yearsOfExperience(): number {
    return this.experience || 0;
  }

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  @ApiProperty({ description: '评分' })
  rating: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '联系电话' })
  phone: string;

  @ApiProperty({ description: '电话号码' })
  get phoneNumber(): string {
    return this.phone || '';
  }

  @Column({ nullable: true })
  @ApiProperty({ description: '电子邮箱' })
  email: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否接单' })
  isActive: boolean;

  @Column('text', { array: true, nullable: true, default: [] })
  @ApiProperty({ description: '专长领域', type: [String] })
  specialties: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  @ApiProperty({ description: '作品集图片', type: [String] })
  portfolioImages: string[];

  @Column('text', { array: true, nullable: true, default: [] })
  @ApiProperty({ description: '使用设备', type: [String] })
  equipments: string[];

  @Column({ nullable: true })
  @ApiProperty({ description: '擅长语言' })
  languagesSpoken: string;

  @Column({ default: false })
  @ApiProperty({ description: '是否接受加急工作' })
  acceptsRushJobs: boolean;

  @OneToMany(() => Booking, booking => booking.photographer)
  bookings: Booking[];

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
