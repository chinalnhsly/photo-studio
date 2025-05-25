import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Photographer } from '../../photographer/entities/photographer.entity';
import { ReviewImage } from './review-image.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  bookingId: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ nullable: true })
  photographerId: number;

  @ManyToOne(() => Photographer, { nullable: true })
  @JoinColumn({ name: 'photographerId' })
  photographer: Photographer;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isAnonymous: boolean;

  @Column({ default: false })
  isRecommended: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  reply: string;

  @Column({ 
    type: 'timestamptz',
    name: 'reply_time',
    nullable: true 
  })
  @ApiProperty({ description: '回复时间' })
  replyTime: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  rejectReason: string;

  @OneToMany(() => ReviewImage, image => image.review, {
    cascade: true
  })
  images: ReviewImage[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ 
    type: 'timestamptz',
    name: 'review_date'
  })
  @ApiProperty({ description: '评价日期' })
  reviewDate: Date;

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
